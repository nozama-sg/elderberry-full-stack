import json
from flask import request
from hctools import users

def getElderlyProfile():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    userId = int(obj['userId'])
    return json.dumps(users.getElderlyProfile(userId))

def getCaregiverProfile():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    username = obj['username']
    return json.dumps(users.getCaregiverProfile(username))

def createElderly():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    name = obj['name']
    age = int(obj['age'])
    height = int(obj['height'])
    weight = int(obj['weight'])
    bmi = round(weight / (height/100) ** 2, 2)
    caregiverUserId = int(obj['caregiverUserId'])
    gender = obj['gender']
    if gender not in ['male', 'female']:
        return {'status': 300, 'error': 'Invalid Gender'}
    return json.dumps(users.createElderly(name, age, caregiverUserId, height, weight, bmi, gender))

def createCaregiver():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    name = obj['name']
    username = obj['username']
    password = obj['password']
    return json.dumps(users.createCaregiver(name, password, username))

def authenticateCaregiver():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    username = obj['username']
    password = obj['password']
    return json.dumps(users.authenticateCaregiver(username, password))
