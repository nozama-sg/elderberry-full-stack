import base64
import subprocess
import mysql.connector 
from uuid import uuid4
from pprint import pprint
from password import SQL_PASSWORD
from datetime import datetime, timedelta
from foodAI import getFoodGroups

""" FIXED NAMES OF BUCKETS OR DATABSES """
FOOD_IMAGES_BUCKET = 'hackathon-food-images'

""" PREFIXES IS FOR RUNNING OF HUAWEI LIBRARY COMMANDS """
OBSUTIL_PREFIX = './../obsutil/obsutil'

''' ADDING MEAL THAT DOES NOT RUN FOOD RECOGNITION FOR REPORTS ''' 
def mockMeal(userId, timestamp):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='food'
    )

    mycursor = mydb.cursor()
    sqlCommand = f"INSERT INTO `meals` (userId, timestamp) VALUES ({userId}, CURRENT_TIMESTAMP)"
    mycursor.execute(sqlCommand)
    mydb.commit()

    mycursor.execute("SELECT LAST_INSERT_ID()")
    imgId = mycursor.fetchone()[0]
    return imgId

def uploadFoodObject(imagePath, userId): # Uploads a specific food item
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='food'
    )

    mycursor = mydb.cursor()
    ''' RUN RECOGNITION AI '''
    foodGroups = getFoodGroups(imagePath)

    if foodGroups == []:
        ''' IF NO FOOD DETECTED ''' 
        subprocess.run(f"rm {imagePath}", shell=True)
        return {'status': 200, 'foodFound': False}
    
    ''' UPLOAD IMAGE TO OBS ''' 
    imgUUID = uuid4()
    cmd = f'{OBSUTIL_PREFIX} cp {imagePath} obs://{FOOD_IMAGES_BUCKET}/{imgUUID}.jpg'
    process = subprocess.run(cmd, shell=True, capture_output=True)
    imgLink = f"https://{FOOD_IMAGES_BUCKET}.obs.ap-southeast-3.myhuaweicloud.com/{imgUUID}.jpg"

    sqlCommand = f"INSERT INTO `meals` (userId, timestamp, imgLink) VALUES ({userId}, CURRENT_TIMESTAMP, '{imgLink}')"
    mycursor.execute(sqlCommand)
    mydb.commit()

    mycursor.execute("SELECT LAST_INSERT_ID()")
    imgId = mycursor.fetchone()[0]

    for food in foodGroups:
        sqlCommand = f"INSERT INTO `foodgroups` (imgId, foodType, foodGroup, confidence) VALUES ({imgId}, '{food['foodType']}', '{food['foodGroup']}', {food['confidence']})"
        mycursor.execute(sqlCommand)
        mydb.commit()

    subprocess.run(f"rm {imagePath}", shell=True)
    return {'stauts': 200, 'foodFound': True}

def getFoodObjectsByDate(userId, startDate, endDate): # Gets all images from a certain date
    ''' READ REPLICA ''' 
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='food'
    )

    mycursor = mydb.cursor()
    startTime = datetime(startDate.year, startDate.month, startDate.day, 0,0,0)
    endTime = datetime(endDate.year, endDate.month, endDate.day, 23, 59, 59)
    
    sqlCommand = f"SELECT * FROM `meals` RIGHT JOIN `foodgroups` ON meals.imgId = foodgroups.imgId WHERE userId = {userId} AND timestamp BETWEEN '{startTime}' AND '{endTime}' ORDER BY timestamp DESC"
    mycursor.execute(sqlCommand)
    results = mycursor.fetchall()
    output = []

    for result in results:
        if len(output) > 0 and output[-1]['mealId'] == result[0]:
            ''' combine '''
            output[-1]['food'].append({
                'foodId': result[4],
                'foodName': result[6],
                'foodGroup': result[7],
                'confidence': result[8]
            })
        else:
            output.append({
                'mealId': result[0],
                'userId': result[1],
                'timestamp': result[2].strftime("%Y-%m-%d %X"),
                'imgUrl': result[3],
                'food': [{
                    'foodId': result[4],
                    'foodName': result[6],
                    'foodGroup': result[7],
                    'confidence': result[8]
                }]
            })
    return output

def getLastMeal(userId):
    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='food'
    )

    mycursor = mydb.cursor(buffered=True)
    
    sqlCommand = f'SELECT * FROM `meals` WHERE userId = {userId} ORDER BY timestamp DESC'
    mycursor.execute(sqlCommand)
    result = mycursor.fetchone()
    ''' NO FOOD GROUP FOUND '''
    if result == None:
        return {}

    mycursor = mydb.cursor()
    sqlCommand = f"SELECT * FROM `foodgroups` WHERE imgId = {result[0]}"
    mycursor.execute(sqlCommand)
    foodgroups = mycursor.fetchall()

    return {
        'mealId': result[0],
        'userId': result[1],
        'timestamp': result[2].strftime("%Y-%m-%d %X"),
        'imgUrl': result[3],
        'food': [{
            'foodId': i[0],
            'foodName': i[2],
            'foodGroup': i[3],
            'confidence': i[4]
            } for i in foodgroups]
    }

def updateFoodGroup(foodId, foodGroup):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='food'
    )

    mycursor = mydb.cursor()
    sqlCommand = f"UPDATE `foodgroups` SET foodGroup = '{foodGroup}' WHERE foodId = {foodId}"
    mycursor.execute(sqlCommand)
    mydb.commit()
    return {'status':200}

def addFoodGroup(mealId, foodName, foodGroup):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='food'
    )

    mycursor = mydb.cursor()
    sqlCommand = f"INSERT INTO `foodgroups` (imgId, foodType, foodGroup, confidence) VALUES ({mealId}, '{foodName}', '{foodGroup}', 1)"
    mycursor.execute(sqlCommand)
    mydb.commit()

    mycursor.execute("SELECT LAST_INSERT_ID()")
    foodId = mycursor.fetchone()[0]
    
    return {'foodId':foodId}

def deleteEntry(foodId):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='food'
    )

    mycursor = mydb.cursor()
    sqlCommand = f"DELETE FROM `foodgroups` WHERE foodId = {foodId}"
    mycursor.execute(sqlCommand)
    mydb.commit()
    return {'status':200}

if __name__ == '__main__':

    pass
