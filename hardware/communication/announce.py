import flask
import time
import os
import requests
import vlc
import userpass
import sqlite3
import datetime
from gtts import gTTS
from pyngrok import ngrok
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler({'apscheduler.timezone': 'Asia/Singapore'})

userId = 227
endpointUpdateURL = 'http://119.13.104.214:80/announcementEndpointUpdate'
ngrok.set_auth_token(userpass.token)

# creating tunnel endpoint
print("Creating Tunnel")
ngrok_tunnel = ngrok.connect(5000)
tunnelURL = ngrok_tunnel.public_url
print(f"Tunnel created at URL: {tunnelURL}")

# posting endpoint to GaussDB server
data = {
    "userId": userId,
    "tunnelUrl": tunnelURL
}
try:
    response = requests.post(endpointUpdateURL, json=data)
    if response.status_code != 200:
        print(f"\nENDPOINT POST ERROR: {response.status_code} | {response.text}")
    else:
        print(f"tunnelURl {tunnelURL} has been updated to database")
except:
    print('ERROR: Unable to update server endpoint')


def announceReminder(reminderTimeUUID):
    print('Announcing Reminder!')
    print(reminderTimeUUID)
    db = sqlite3.connect('reminders.db')
    db.row_factory = sqlite3.Row
    cursor = db.cursor()

    medicineName = cursor.execute("""SELECT medicine.medicine FROM medicine INNER JOIN reminderTime on medicine.medicineReminderId = reminderTime.medicineReminderId WHERE reminderTime.reminderTimeUUID = ?""", (reminderTimeUUID,)).fetchone()

    print(medicineName)

    tts = gTTS(f"This is a reminder to take your {medicineName['medicine']} medicine.")
    tts.save('reminder-tmp.mp3')
    player = vlc.MediaPlayer('reminder-tmp.mp3')
    player.play()
    time.sleep(1)

    player.play()

    os.remove('reminder-tmp.mp3')

    print("Reminder announced!")

# flask server
app = flask.Flask(__name__)

# start scheduler
scheduler.start()
db = sqlite3.connect('reminders.db')
db.row_factory = sqlite3.Row
cursor = db.cursor()

results = cursor.execute("""SELECT * FROM reminderTime""").fetchall()
for reminderItem in results:
    reminderTime = reminderItem['reminderTime']
    reminderTimeUUID = reminderItem['reminderTimeUUID']

    hourNum = int(reminderTime.split(':')[0])
    minuteNum = int(reminderTime.split(':')[1])

    scheduler.add_job(announceReminder, 'cron', hour=hourNum, minute=minuteNum, id=str(reminderTimeUUID), args=[reminderTimeUUID])
    
# announceAudio + sendAudio
@app.route('/announceMessage', methods=['POST'])
def announceMessage():
    try:
        # get json value from request
        content = flask.request.json
        text = content['text']
        print(f"Received message: {text}")

    except Exception as e:
        print(e)
        return 'Invalid JSON for announceMessage'

    # get the list of files in the directory and fullPath of files
    fileList = os.listdir('announceMessage')
    fullPath = [f"./announceMessage/{name}" for name in fileList]
    
    # determining fileName
    if len([name for name in fileList]) == 0:
            count = 1
    else:
        newestFile = max(fullPath, key=os.path.getctime)
        count = int(newestFile.split('/')[-1].split('.')[0].split('_')[-1]) + 1

    # save message to file
    with open(f"./announceMessage/message_{count}.txt", "w") as file:
        file.writelines(text)

    tts = gTTS(text)
    tts.save('announceMessage-tmp.mp3')
    player = vlc.MediaPlayer('announceMessage-tmp.mp3')
    player.play()
    time.sleep(3)
    os.remove('announceMessage-tmp.mp3')

    return "OK"

@app.route('/announceAudio', methods=['POST'])
def announceAudio():
    try:
        content = flask.request.json
        URL = content['URL']
        print(f"Received audio: {URL}")

    except Exception as e:
        print(f"Error: {e}")
        print(content)
        return 'Invalid JSON for announceAudio'

    fileType = URL.split('.')[-1]

    # get the list of files in the directory and fullPath of files
    fileList = os.listdir('announceAudio')
    fullPath = [f"./announceAudio/{name}" for name in fileList]

    # remove oldest file
    if len([name for name in fileList]) > 10:
        oldestFile = min(fullPath, key=os.path.getctime)
        os.remove(oldestFile)

    # update list of files in dir and fullpath of files
    fileList = os.listdir('announceAudio')
    fullPath = [f"./announceAudio/{name}" for name in fileList]

    # determining new file name
    if len([name for name in fileList]) == 0:
        count = 1
    else:
        newestFile = max(fullPath, key=os.path.getctime)
        count = int(newestFile.split('/')[-1].split('.')[0].split('_')[-1]) + 1

    # download audio file
    r = requests.get(URL)
    with open(f"./announceAudio/audio_{count}.{fileType}", "wb") as f:
        f.write(r.content)
    
    # play audio file
    player = vlc.MediaPlayer(f"./announceAudio/audio_{count}.{fileType}")
    player.play()

    return 'OK'

@app.route('/medicineReminder/new', methods=['POST'])
def addMedicineReminder():
    db = sqlite3.connect('reminders.db')
    db.row_factory = sqlite3.Row
    cursor = db.cursor()

    try:
        userId = int(flask.request.json['userId'])
        medicine = flask.request.json['medicine']
        timeList = flask.request.json['time']
    except Exception as e:
        return f"Invalid JSON, Error: {e}"

    result = cursor.execute(f"SELECT * FROM medicine WHERE userId = {userId} AND medicine = '{medicine}'").fetchall()
    if len(result) != 0:
        return f"Already exists"

    # get generated medicine ID
    cursor.execute(f"INSERT INTO medicine(userId, medicine) VALUES (?,?)",(userId, medicine))
    db.commit()

    medicineReminderId = cursor.execute(f"SELECT * FROM medicine WHERE userId = {userId} AND medicine = '{medicine}'").fetchall()[0]['medicineReminderId']

    # insert timing into reminderTime
    for time in timeList:
        cursor.execute("""INSERT INTO reminderTime(medicineReminderId, reminderTime) VALUES (?,?)""", (medicineReminderId, time))

        reminderTimeUUID = cursor.execute("""SELECT * FROM reminderTime WHERE medicineReminderId = ? AND reminderTime = ?""",(medicineReminderId, time)).fetchall()[0]['reminderTimeUUID']

        hourNum = int(time.split(':')[0])
        minuteNum = int(time.split(':')[1])

        scheduler.add_job(announceReminder, 'cron', hour=hourNum, minute=minuteNum, id=str(reminderTimeUUID), args=[reminderTimeUUID])

    db.commit()
    

    #announceReminder(reminderTimeUUID='hi')
    #schedules = []
    #for job in scheduler.get_jobs():
    #    jobdict = {}
    #    for f in job.trigger.fields:
    #        curval = str(f)
    #        jobdict[f.name] = curval
    #    schedules.append(jobdict)

    #print(schedules)
    #print(datetime.datetime.now(scheduler.timezone))
    return str(medicineReminderId)

@app.route('/medicineReminder/delete', methods=['POST'])
def deleteMedicineReminder():
    db = sqlite3.connect('reminders.db')
    db.row_factory = sqlite3.Row
    cursor = db.cursor()

    try:
        medicineReminderId = flask.request.json['medicineReminderId']
    except Exception as e:
        return f"Invalid JSON, Error: {e}"

    result = cursor.execute("""SELECT * FROM medicine WHERE medicineReminderId = ?""",(medicineReminderId,)).fetchall()

    if len(result) == 0:
        return f"Medicine does not exist"

    reminders = cursor.execute(f"SELECT * FROM reminderTime WHERE medicineReminderId = {medicineReminderId}").fetchall()

    if len(reminders) == 0:
       return f"All reminders already deleted"

    for reminder in reminders:
        scheduler.remove_job(str(reminder['reminderTimeUUID']))

    cursor.execute(f"DELETE FROM reminderTime WHERE medicineReminderId = {medicineReminderId}")
    cursor.execute(f"DELETE FROM medicine WHERE medicineReminderId = {medicineReminderId}")
    db.commit()

    return 'OK'

@app.route('/getAllMedicineReminders', methods=['POST'])
def getAllMedicineReminders():
    db = sqlite3.connect("reminders.db")
    db.row_factory = sqlite3.Row
    cursor = db.cursor()

    try:
        userId = flask.request.json['userId']
    except Exception as e:
        return f"Invalid JSON, Error: {e}"

    result = cursor.execute("""SELECT * FROM medicine WHERE userId = ?""",(userId,)).fetchall()

    if len(result) == 0:
        return f"User does not exist"

    returnList = []
    for medicine in result:
        reminderId = medicine['medicineReminderId']
        reminderTimes = cursor.execute("""SELECT * FROM reminderTime WHERE medicineReminderId = ?""",(reminderId,)).fetchall()
        timeList = []
        for reminderTime in reminderTimes:
            timeList.append(reminderTime['reminderTime'])
        
        returnList.append({"medId":reminderId, "medicine":medicine['medicine'], "time":timeList})

    return flask.jsonify({'data':returnList})


@app.route('/')
def index():
    return f"Server is running on {tunnelURL}"

app.run(host='0.0.0.0', port=5000)
