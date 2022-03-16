import base64
import requests
import sentiment
import subprocess
import mysql.connector 
from uuid import uuid4
from io import BytesIO
from pprint import pprint
import speech_recognition as sr
from password import SQL_PASSWORD

""" FIXED NAMES OF BUCKETS OR DATABSES """
AUDIO_FILES_BUCKET = 'hackathon-audio-files'

""" PREFIXES IS FOR RUNNING OF HUAWEI LIBRARY COMMANDS """
OBSUTIL_PREFIX = './../obsutil/obsutil'

''' https://realpython.com/python-speech-recognition/ '''
def getAudio(src): 
    ''' SRC is the path to audio file '''
    try:
        r = sr.Recognizer()
        with sr.AudioFile(src) as source:
            # listen for the data (load audio to memory)
            audio_data = r.record(source)
            # invoke API (convert from speech to text)
            text = r.recognize_google(audio_data)
            return text
    except speech_recognition.UnknownValueError:
        return ""

def sendRequest(command, userId, data):
    ''' MAIN NODE ''' 
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='communication'
    )
    mycursor = mydb.cursor()
    sqlCommand = f"SELECT tunnelUrl FROM `tunnels` WHERE userId = '{userId}'"
    mycursor.execute(sqlCommand)
    result = mycursor.fetchone()
    if result == None:
        return {'status': 300, 'error': 'No tunnel URL found!'}
    url = f'{result[0]}/{command}' # Either recorded or announce message
    for i in range(10):
        try:
            response = requests.post(url, json=data)
            return {'status': response.status_code}
        except Exception as e:
            print(e)
            pass
    return {'status': 300, 'error': 'Announcement Failed!'}

def recordElderlyMessage(userId, audio):
    ''' MAIN NODE ''' 
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='communication'
    )
    mycursor = mydb.cursor()
    ''' INSERT INTO OBS'''
    audioFileName = f'tmp/{uuid4()}.wav'
    with open(audioFileName, "wb") as audioFile:
        st = base64.b64decode(audio)
        audioFile.write(st)
        text = getAudio(audioFileName)
        text = text.replace("'", "")

    ''' SENTIMENT ANALYSIS '''
    positivity = sentiment.sentimentAnalysis(text)

    id = uuid4() 
    cmd =f'{OBSUTIL_PREFIX} cp {audioFileName} obs://{AUDIO_FILES_BUCKET}/{id}.wav'
    process = subprocess.run(cmd, shell=True, capture_output=True)
    obsUrl = f'https://{AUDIO_FILES_BUCKET}.obs.ap-southeast-3.myhuaweicloud.com/{id}.wav'
    ''' INSERT INTO DB '''
    sqlCommand = f"INSERT INTO `announcements` (userId, audioLink, announcementText, author, timestamp, sentiment) VALUES ({userId}, '{obsUrl}', '{text}', 'elderly', CURRENT_TIMESTAMP, {positivity})"
    mycursor.execute(sqlCommand)
    mydb.commit()

    subprocess.run(f'rm {audioFileName}', shell=True)

    return {'status': 200}

def recordCaregiverMessage(userId, audio):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='communication'
    )
    mycursor = mydb.cursor()
    ''' INSERT INTO OBS'''
    audioFileName = f'tmp/{uuid4()}.wav'
    with open(audioFileName, "wb") as audioFile:
        st = base64.b64decode(audio)
        audioFile.write(st)
        text = getAudio(audioFileName)

    id = uuid4() 
    cmd =f'{OBSUTIL_PREFIX} cp {audioFileName} obs://{AUDIO_FILES_BUCKET}/{id}.wav'
    process = subprocess.run(cmd, shell=True, capture_output=True)
    obsUrl = f'https://{AUDIO_FILES_BUCKET}.obs.ap-southeast-3.myhuaweicloud.com/{id}.wav'
    ''' INSERT INTO DB '''
    sqlCommand = f"INSERT INTO `announcements` (userId, audioLink, announcementText, author, timestamp) VALUES ({userId}, '{obsUrl}', '{text}', 'caregiver', CURRENT_TIMESTAMP)"
    mycursor.execute(sqlCommand)
    mydb.commit()

    return sendRequest('announceAudio', userId, {'URL': obsUrl})

def announceMessage(userId, announcementText):
    ''' MAIN NODE ''' 
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='communication'
    )
    mycursor = mydb.cursor()
    ''' INSERT INTO DB '''
    sqlCommand = f"INSERT INTO `announcements` (userId, announcementText, timestamp, author) VALUES ({userId}, '{announcementText}', CURRENT_TIMESTAMP, 'caregiver') "
    mycursor.execute(sqlCommand)
    mydb.commit()

    ''' SENDING REQUEST ''' 
    return sendRequest('announceMessage', userId, {'text': announcementText})

def announcementEndpointUpdate(userId, tunnelUrl):
    ''' MAIN NODE ''' 
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='communication'
    )
    mycursor = mydb.cursor()

    ''' CHECK IF USERID IS ALREADY IN DB ''' 
    sqlCommand = f"SELECT userId FROM `tunnels` WHERE userId = {userId}"
    mycursor.execute(sqlCommand)
    result = mycursor.fetchone()
    
    ''' NOT YET IN DB '''
    if result == None:
        mycursor.execute (f"INSERT INTO `tunnels` (userId, tunnelUrl) VALUES ({userId}, '{tunnelUrl}')")
        mydb.commit()
        return {'status': 200, 'comments': 'Created New Entry'}
    else:
        mycursor.execute (f"UPDATE `tunnels` SET tunnelUrl = '{tunnelUrl}' WHERE userId = {userId}")
        mydb.commit()
        return {'status': 200, 'comments': 'Updated Existing Entry'}

def getConversation(userId):
    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='communication'
    )
    mycursor = mydb.cursor()
    sqlCommand = f"SELECT * FROM `announcements` WHERE userId = '{userId}'"
    mycursor.execute(sqlCommand)
    result = mycursor.fetchall()
    return [{
        'announcementId':i[0],
        'text': i[1],
        'timestamp': i[2].strftime("%Y/%m/%d, %H:%M:%S"),
        'userId': i[3],
        'audioLink': i[4],
        'author': i[5]
    } for i in result]

def analyseConversation(userId, firstDate, lastDate):
    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='communication'
    )
    mycursor = mydb.cursor()

    firstDateString = firstDate.strftime("%Y-%m-%d, %H:%M:%S")
    lastDateString = lastDate.strftime("%Y-%m-%d, %H:%M:%S")
    sqlCommand = f"SELECT sentiment,author FROM `announcements` WHERE timestamp BETWEEN '{firstDateString}' AND '{lastDateString}' AND userId = {userId}"
    #print(sqlCommand)
    mycursor.execute(sqlCommand)
    result = mycursor.fetchall()

    conversationCount = len(result)
    ''' GET ALL CONVERSATIONS WITH LOGGED SENTIMENT ''' 
    elderlyMessages = len([i for i in result if i[1] == 'elderly'])
    caregiverMessages = len([i for i in result if i[1] == 'caregiver'])

    sentiment = [i[0] for i in result if i[1] == 'elderly' and i[0] is not None]
    meanSentiment = 0
    if len(sentiment): meanSentiment = round(sum(sentiment) / len(sentiment), 2)
    return {
        'elderlyMessages': elderlyMessages,
        'caregiverMessages': caregiverMessages,
        'meanSentiment': meanSentiment
    }

def mockElderlyMessage(userId, timestamp, sentiment):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='communication'
    )
    mycursor = mydb.cursor()

    sqlCommand = f"INSERT INTO `announcements` (userId, author, timestamp, sentiment) VALUES ({userId},'elderly', '{timestamp}', {sentiment})"
    mycursor.execute(sqlCommand)
    mydb.commit()

def mockCaregiverMessage(userId, timestamp):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='communication'
    )
    mycursor = mydb.cursor()

    sqlCommand = f"INSERT INTO `announcements` (userId, author, timestamp) VALUES ({userId}, 'caregiver', '{timestamp}') "
    mycursor.execute(sqlCommand)
    mydb.commit()

if __name__ == '__main__':
    #announcementEndpointUpdate(11, 'https://tidy-insect-49.loca.lt/') 
    #announceMessage(13, 'hello!')
    pprint(analyseConversation(9))

