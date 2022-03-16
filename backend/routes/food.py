import json
import base64
import subprocess
from PIL import Image
from io import BytesIO
from uuid import uuid4
from flask import request
from hctools import food
from datetime import datetime

def uploadFoodImage():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    userId = int(obj['userId'])
    image = obj['image']
    image = Image.open(BytesIO(base64.b64decode(image)))
    imagePath = f'tmp/{uuid4()}.jpg'
    image.save(imagePath, 'png')
    return json.dumps(food.uploadFoodObject(imagePath, userId))
    return json.dumps({'status':200})

def queryFoodImages():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    userId = int(obj['userId'])
    date = datetime.strptime(obj['date'], "%Y-%m-%d")
    return json.dumps(food.getFoodObjectsByDate(userId, date,date))

def queryLastMeal():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    userId = int(obj['userId'])
    return json.dumps(food.getLastMeal(userId))

def updateFoodGroup():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    foodGroup = obj['correctFoodGroup']
    foodId = int(obj['foodId'])
    if foodGroup not in ['dairy', 'dessert', 'fruit', 'grain', 'protein', 'vegetables']:
        return json.dumps({'status': 300, 'error': 'Invalid Food Group!'})
    return json.dumps(food.updateFoodGroup(foodId, foodGroup))

def addFood():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    foodGroup = obj['correctFoodGroup']
    mealId = int(obj['mealId'])
    foodName = obj['foodName']

    if foodGroup not in ['dairy', 'dessert', 'fruit', 'grain', 'protein', 'vegetables']:
        return json.dumps({'status': 300, 'error': 'Invalid Food Group!'})
    return json.dumps(food.addFoodGroup(mealId, foodName, foodGroup))

def deleteEntry():
    obj=request.data.decode("utf-8")
    obj = obj.replace("'", '"') # Replace ' with " for json decoding
    obj = json.loads(obj)
    foodId = int(obj['foodId'])

    return json.dumps(food.deleteEntry(foodId))
