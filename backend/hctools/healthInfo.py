import mysql.connector 
from pprint import pprint
from calendar import monthrange
from password import SQL_PASSWORD
from anomaly import getBoundaries, getAnomaliesDaily
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

''' https://techoverflow.net/2019/05/16/how-to-get-number-of-days-in-month-in-python/ '''
def number_of_days_in_month(year, month):
    #print(year,month)
    return monthrange(year, month)[1]

def getHealthInformation(healthInfoType, userId, firstDate, lastDate, frequency):
    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='healthData'
    )

    mycursor = mydb.cursor()
    
    healthInfoType = healthInfoType.lower()
    firstDateString = firstDate.strftime("%Y-%m-%d, %H:%M:%S")
    lastDateString = lastDate.strftime("%Y-%m-%d, %H:%M:%S")
    sqlCommand = f"SELECT value,timestamp FROM `{healthInfoType}` WHERE timestamp BETWEEN '{firstDateString}' AND '{lastDateString}' AND userId = {userId}"
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

    if healthInfoType == 'stepcount':
        ''' STEP COUNT IS SEPARATE DUE TO CUMULATIVE ''' 
        if frequency == 'day':
            datapoints = [i[0] for i in result]
            total = 0 if len(datapoints) == 0 else max(datapoints)
            for i in range(24):
                data[i] = [int(total/24)]
            leftover = total - 24*int(total/24)
            for i in range(leftover):
                data[i][0] += 1
        elif frequency in ['week', 'month']:
            ''' CALCULATE MAXIMUM STEP COUNTS OF DATES ''' 
            dailyMax = {}

            for entry in result:
                dateString = entry[1].strftime("%d/%m/%Y")
                if dateString not in dailyMax.keys():
                    dailyMax[dateString] = entry[0]
                else:
                    dailyMax[dateString] = max(dailyMax[dateString], entry[0])

            for dateString in dailyMax:
                value = dailyMax[dateString]
                timestamp = datetime.strptime(dateString, "%d/%m/%Y")
                if frequency == 'week': target = timestamp.weekday()
                elif frequency == 'month': target = timestamp.day
                data[target] = [value]
        elif frequency == 'year':
            monthlyMax = {}

            for entry in result:
                dateString = entry[1].strftime("%m/%Y")
                if dateString not in monthlyMax.keys():
                    monthlyMax[dateString] = entry[0]
                else:
                    monthlyMax[dateString] = max(monthlyMax[dateString], entry[0])

            for dateString in monthlyMax:
                value = monthlyMax[dateString]
                timestamp = datetime.strptime(dateString, "%m/%Y")
                target = timestamp.month
                data[target] = [value]

    else: 
        for entry in result:
            target = 0 
            value = entry[0]
            timestamp = entry[1]
            if frequency == 'day':target = timestamp.hour
            elif frequency == 'week': target = timestamp.weekday()
            elif frequency == 'month': target = timestamp.day
            elif frequency == 'year': target = timestamp.month

            data[target].append(value)

    processedData = []
    for i in data:
        id = i
        values = data[i]
        if len(values) == 0:
            processedData.append({'y': 0, 'x': i})
        else:
            processedData.append({'y': round(sum(values)/len(values),2), 'x': i})
    return processedData

def updateHealthInformation(healthInfoType, userId, value, timestamp):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='healthData'
    )

    mycursor = mydb.cursor()
    
    healthInfoType = healthInfoType.lower()
    if timestamp == None:
        sqlCommand = f"INSERT INTO `{healthInfoType}` (userId, value, timestamp) VALUES ({userId}, {value}, CURRENT_TIMESTAMP)"
    else:
        sqlCommand = f"INSERT INTO `{healthInfoType}` (userId, value, timestamp) VALUES ({userId}, {value}, '{timestamp}')"

    mycursor.execute(sqlCommand)
    mydb.commit()
    return {'status': 200}

def getAllHealthInformation(healthInfoType, userId, firstDate, lastDate, frequency):
    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='healthData'
    )

    mycursor = mydb.cursor()
    
    healthInfoType = healthInfoType.lower()
    firstDateString = firstDate.strftime("%Y-%m-%d, %H:%M:%S")
    lastDateString = lastDate.strftime("%Y-%m-%d, %H:%M:%S")
    sqlCommand = f"SELECT value,timestamp FROM `{healthInfoType}` WHERE timestamp BETWEEN '{firstDateString}' AND '{lastDateString}' AND userId = {userId}"
    mycursor.execute(sqlCommand)
    result = mycursor.fetchall() 
    output = {} 

    for i in result:
        dateString = i[1].strftime("%Y-%m-%d %X")
        value = i[0]
        if dateString not in output.keys():
            output[dateString] = [value]
        else:
            output[dateString].append(value)

    returnValue = {}
    for i in output:
        if healthInfoType == 'stepCount':
            returnValue[i] = max(output[i])
        else:
            returnValue[i] = sum(output[i]) / len(output[i])
        returnValue[i] = round(returnValue[i], 2)

    return returnValue

def runAnomaly(userId, healthInfoType):
    '''
    RUNS ANOMALY DETECTION ON THE HOURLY DATA FOR THE LAST 1 MONTH
    '''
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='reports'
    )

    mycursor = mydb.cursor()
    
    ''' DATA HAS BEEN GENERATED BEFORE, RETURN STORED DATA '''
    sqlCommand = f"SELECT * FROM `anomalyData` WHERE userId = {userId} AND healthInfoType = '{healthInfoType}'"
    mycursor.execute(sqlCommand)
    result = mycursor.fetchone()
    if result != None:
       lower,upper = result[3], result[4] 
       return lower, upper

    ''' GENERATING NEW ANOMALY DATA ''' 
    now = datetime.now()
    lastday = datetime(now.year, now.month+1, 1) - timedelta(seconds=1) 
    firstday = lastday - relativedelta(years=1)
    info = getAllHealthInformation(healthInfoType, userId, firstday, lastday, "year")
    x, y = list(info.keys()) , []
    for i in x:
        y.append(info[i])
    firstday = lastday - relativedelta(months=1) + timedelta(seconds = 1)
    lower,upper = getBoundaries(x,y, firstday)
    sqlCommand = f"INSERT INTO `anomalyData` (userId, healthInfoType, lower, upper) VALUES ({userId}, '{healthInfoType}', {lower}, {upper})"
    mycursor.execute(sqlCommand)
    mydb.commit()

    return [lower,upper] 

def hourlyAnomaly(userId, healthInfoType):
    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='healthData'
    )

    mycursor = mydb.cursor()
    ''' 
    RUNS ANOMALY DETECTION ON THE LAST MONTH HOURLY DATA
    '''
    now = datetime.now()
    x = []
    y = []
    lastday = datetime(now.year, now.month, now.day, 23, 59, 59)
    firstday = lastday - relativedelta(months=1, seconds=-1)
    healthInfoType = healthInfoType.lower()
    firstDateString = firstday.strftime("%Y-%m-%d, %H:%M:%S")
    lastDateString = lastday.strftime("%Y-%m-%d, %H:%M:%S")
    sqlCommand = f"SELECT value,timestamp FROM `{healthInfoType}` WHERE timestamp BETWEEN '{firstDateString}' AND '{lastDateString}' AND userId = {userId}"
    mycursor.execute(sqlCommand)
    results = mycursor.fetchall() 
    x = []
    while firstday < lastday:
        x.append(firstday)
        y.append(0)
        if healthInfoType == 'sleepseconds':
            firstday = firstday + relativedelta(days=1)
        else:
            firstday = firstday + timedelta(hours=1)

    for result in results:
        for i in range(len(x)):
            date = x[i]
            ''' IF DATES ARE < 0.5 HOURS APART '''
            if abs((result[1] - date).seconds) <= 30*60 and abs((result[1] - date).days) == 0:
                y[i] = max(y[i], result[0])
                break

    anomalies = getAnomaliesDaily(x,y,datetime(now.year, now.month, now.day))
    output = []
    indexes = set()

    for anomaly in anomalies:
        anomaly['date'] = str(anomaly['date'])
        date = datetime.strptime(anomaly['date'], '%Y-%m-%d %H:%M:%S')
        i = x.index(date)
        indexes.add(i) # CHECKS THAT THE PREVIOUS ELEMENT IS NOT AN ANOMALY

    for anomaly in anomalies:
        date = datetime.strptime(anomaly['date'], '%Y-%m-%d %H:%M:%S')
        i = x.index(date)
        if i-1 in indexes:
            continue
        if i == 0: anomaly['type'] = 'higher'
        else:
            if y[i] > y[i-1]: anomaly['type'] = 'higher'
            else: anomaly['type'] = 'lower'
            anomaly['delta'] = y[i] - y[i-1]
        output.append(anomaly)

    return output 

if __name__ == '__main__':
    x = hourlyAnomaly(12, 'heartRate')
    print(x)
