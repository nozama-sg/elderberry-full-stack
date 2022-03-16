import json
import requests
from uuid import uuid4
from hctools import reports
from datetime import datetime
from mockdata import mockReport, mockAnomaly
from flask import request, render_template, redirect

def generateReport():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    userId = int(obj['userId'])
    id = uuid4()
    reports.generateReport(id, userId)
    return {"id": id}

def getReport(reportUUID):
    ''' CHECK IF REPORT UUID IS VALID '''
    reportInfo = reports.getReportInfo(reportUUID)

    if reportInfo == {}:
        return render_template('report-not-found.html', error = 'No Report Found')

    now = datetime.now()
    timestamp = reportInfo['timestamp']
    userId = reportInfo['userId']
    difference = now - timestamp
    timeSeconds = difference.total_seconds()
    if timeSeconds > 3600:
        return render_template('report-not-found.html', error = 'Report Expired')

    data = reports.getData(userId)

    return render_template('index.html', data=data)

def getMockReport():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    activityStatus = int(obj['activityStatus'])
    indoorStatus = int(obj['indoorStatus'])
    sleepStatus = int(obj['sleepStatus'])

    return json.dumps(mockReport.generateReport(activityStatus, indoorStatus, sleepStatus))

def getMockAnomaly():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    heartRate = int(obj['heartRate'])
    sleepSeconds = int(obj['sleepSeconds'])
    stepAsymmetry = int(obj['stepAsymmetry'])
    stepCount = int(obj['stepCount'])
    caregiverUsername = uuid4()
    if 'username' in obj.keys():
        caregiverUsername = obj['username']

    return json.dumps(mockAnomaly.generateAnomaly(heartRate, sleepSeconds, stepAsymmetry, stepCount, caregiverUsername))

def customizeReport():
    if request.method == 'GET':
        return render_template('customizeReport.html')
    elif request.method == 'POST':
        activityStatusSelect = request.form['activityStatusSelect']
        indoorStatusSelect = request.form['indoorStatusSelect']
        sleepStatusSelect = request.form['sleepStatusSelect']

        activityStatusMap = {"Very Active":2, "Somewhat Active":1, "Not Active": 0}
        activityStatus = activityStatusMap[activityStatusSelect]
        indoorStatusMap = {"All the time": 2, "Sometimes": 1, "Not at all, Prefers staying indoors":0}
        indoorStatus = indoorStatusMap[indoorStatusSelect]
        sleepStatusMap = {"Sleeps Very Well":2, "Average Sleep Quality": 1, "Sleeps Poorly": 0}
        sleepStatus = sleepStatusMap[sleepStatusSelect]

        id = activityStatus*9+indoorStatus*3+sleepStatus
        data = {'userId': 277+id}
        response = requests.post('http://119.13.104.214:80/generateReport', json=data)
        json = response.json()
        url = f"http://119.13.104.214/getReport/{json['id']}"
        return redirect(url)

        ''' MOCK REPORT '''
        #data = {'activityStatus': activityStatus, 'indoorStatus': indoorStatus, 'sleepStatus': sleepStatus}
        #response = requests.get('http://119.13.104.214:80/mockReport', json=data)
        #json = response.json()
        #url = json['url']
        #return redirect(url)

