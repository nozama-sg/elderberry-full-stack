import requests
import os
from pprint import pprint
from password import FOODAI_API_KEY

def getFoodGroups(img):
    api_user_token = FOODAI_API_KEY
    headers = {'Authorization': 'Bearer ' + api_user_token}

    # Detect stuff in image
    url = 'https://api.logmeal.es/v2/image/recognition/complete/v1.0'
    resp = requests.post(
        url, files={'image': open(img, 'rb')}, headers=headers)

    resJson = resp.json()
    
    ''' CHECK FOR NON-FOOD '''
    if 'recognition_results' not in resJson.keys():
        print("RECOGNITION ERROR")
        print(resJson)
        return []

    pprint(resJson)

    # Save image id in database, i need this imageid everytime i request food data

    foodContents = []

    for detectedFood in resJson['recognition_results']:
        obj = {'foodType': detectedFood['name'], 'confidence': detectedFood['prob']}

        foodGroup = 'labelNotFound'

        foodGroupMapping = {
            'dairy': ['milk', 'cheese', 'tofu'],
            'dessert': ['yogurt'],
            'fruit': ['banana','fruit salad', 'pomegranate', 'quince'],
            'grain': ['bread', 'rice', 'noodles', 'porridge', 'oatmeal porridge', 'semolia'],
            'protein': ['meat', 'meat hamburger'],
            'vegetables': ['vegetable', 'tomato']
        }
        
        for category in foodGroupMapping:
            if obj['foodType'] in foodGroupMapping[category]: foodGroup = category

        obj['foodGroup'] = foodGroup

        foodContents.append(obj)

    return foodContents
