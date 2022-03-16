import json
import requests
import base64

def postImageHuawei(imageName, userId):
    with open(f"{imageName}.jpg", "rb") as imageFile:
        imageData = base64.b64encode(imageFile.read())

    data = {
        "userId": userId,
        "image": imageData.decode()
    }

    response = requests.post(foodImageUploadURL, json=data)

    return response

foodImageUploadURL = "http://119.13.104.214:80/food/upload"
print(postImageHuawei('burger',109))
