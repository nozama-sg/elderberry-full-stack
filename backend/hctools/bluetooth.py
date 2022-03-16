import base64
import mysql.connector 
from pprint import pprint
from calendar import monthrange
from password import SQL_PASSWORD
from datetime import datetime, timedelta, date 

''' https://techoverflow.net/2019/05/16/how-to-get-number-of-days-in-month-in-python/ '''
def number_of_days_in_month(year, month):
    #print(year,month)
    return monthrange(year, month)[1]

def locationUpdate(userId, roomName, timestamp):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='triggers'
    )

    mycursor = mydb.cursor()
    if timestamp == None:
        sqlCommand = f"INSERT INTO `roomentrylog` (userId, roomName, timestamp) VALUES ({userId}, '{roomName}', CURRENT_TIMESTAMP)"
    else:
        sqlCommand = f"INSERT INTO `roomentrylog` (userId, roomName, timestamp) VALUES ({userId}, '{roomName}', '{timestamp}')"
    mycursor.execute(sqlCommand)
    mydb.commit()
    return {'status': 200}

def currentLocation(userId):
    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='triggers'
    )

    mycursor = mydb.cursor()

    sqlCommand = f"SELECT * FROM `roomentrylog` WHERE userId = {userId} ORDER BY timestamp DESC LIMIT 1"
    mycursor.execute(sqlCommand)
    result = mycursor.fetchone()
    timeEnterRoom = result[1]
    roomName = result[2]

    now = datetime.now()
    timediff = now - timeEnterRoom

    return {'roomName':roomName, 'timespent': int(timediff.seconds/60)}

def getBluetoothInformation(userId, firstDate, lastDate, frequency):
    print(firstDate, lastDate)

    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='triggers'
    )

    mycursor = mydb.cursor()
    
    firstDateString = firstDate.strftime("%Y-%m-%d, %H:%M:%S")
    lastDateString = lastDate.strftime("%Y-%m-%d, %H:%M:%S")
    sqlCommand = f"SELECT roomName,timestamp FROM `roomentrylog` WHERE timestamp BETWEEN '{firstDateString}' AND '{lastDateString}' AND userId = {userId}"
    mycursor.execute(sqlCommand)
    result = mycursor.fetchall() 
    data = {}
    
    maxValue = 0
    if frequency == 'day': maxValue = 24
    elif frequency == 'week': maxValue = 7
    elif frequency == 'month': maxValue = number_of_days_in_month(lastDate.year, lastDate.month)
    else: maxValue = 12
    if frequency in ['day', 'week']:
        ''' 0 to 23 hours '''
        ''' 0 to 6 days of week '''
        for i in range(maxValue): data[i] = []
    else:
        ''' 1 to 31 days of month '''
        ''' 1 to 12 months of year '''
        for i in range(1, maxValue+1): data[i] = []
	
    for i in result:
        roomName = i[0]
        timestamp = i[1]
        target = i[1].day
        data[target].append({'roomName': roomName, 'timestamp': timestamp})

    for i in data:
        data[i].sort(key = lambda x:x['timestamp'])

    def durationToMidnight(dateObj):
        tix = datetime(dateObj.year, dateObj.month, dateObj.day) + timedelta(days=1)
        td = tix-dateObj
        return td.seconds//60

    for d in data:
        ''' TAKING THE LAST ENTRY FROM PREVIOUS DAY '''
        previousRoomName = 'Bedroom'
        if d-1 in data.keys(): 
            if len(data[d-1]) > 0:
                previousRoomName = data[d-1][-1]['roomName']
        timestamp = firstDate + timedelta(days=d-1, seconds=1)
        data[d].insert(0, {'timestamp': timestamp, 'roomName': previousRoomName})

        ''' NORMAL ENTRIES '''
        for x in range(len(data[d])-1):
            data[d][x]['duration'] = (data[d][x+1]['timestamp'] - data[d][x]['timestamp']).seconds//60
        ''' LAST REQUEST OF THE DAY '''
        if len(data[d]) > 0:
            data[d][-1]['duration'] = durationToMidnight(data[d][-1]['timestamp'])

    ''' PROCESS FROM EACH DAY TO MAP TO TOTAL DURATIONS '''
    roomNames = ['Outside', 'Living Room', 'Bedroom', 'Bathroom', 'Kitchen']
    returnValue = []
    for room in roomNames:
        returnValue.append({'roomName': room, 'times': [0]*len(data)})

    for d in data: 
        ''' FOR EACH DAY ''' 
        for datapoint in data[d]:
            room = datapoint['roomName']
            duration = datapoint['duration']
            index = roomNames.index(room)
            returnValue[index]['times'][d-1] += duration

    return returnValue

def getBluetoothHistory(userId, firstDate, lastDate):

    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='triggers'
    )

    mycursor = mydb.cursor()
    
    firstDateString = firstDate.strftime("%Y-%m-%d, %H:%M:%S")
    lastDateString = lastDate.strftime("%Y-%m-%d, %H:%M:%S")
    sqlCommand = f"SELECT roomName,timestamp FROM `roomentrylog` WHERE timestamp BETWEEN '{firstDateString}' AND '{lastDateString}' AND userId = {userId}"
    mycursor.execute(sqlCommand)
    results = mycursor.fetchall()
    return results

