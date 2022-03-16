import base64
import bcrypt
import mysql.connector 
from password import SQL_PASSWORD

def createElderly(name, age, caregiverUserId, height, weight, bmi, gender):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='users'
    )

    mycursor = mydb.cursor()
    sqlCommand = f"INSERT INTO `elderly` (name, age, caregiverUserId, height, weight, bmi, gender) VALUES ('{name}', {age}, {caregiverUserId}, {height}, {weight},{bmi}, '{gender}')"
    mycursor.execute(sqlCommand)
    mydb.commit()
    mycursor.execute("SELECT LAST_INSERT_ID()")
    userId = mycursor.fetchone()[0]
    return {'userId': userId}

def createCaregiver(name, password, username):
    ''' MAIN NODE '''
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='users'
    )
    mycursor = mydb.cursor()

    ''' CHECK THAT NO SUCH USERR PRESENT ''' 
    sqlCommand = f"SELECT * FROM `caregivers` WHERE username = '{username}'"
    #print(sqlCommand)
    mycursor.execute(sqlCommand)
    if mycursor.fetchone() is not None:
        return {'status': 300, 'error': 'Username already taken!'}

    ''' ENCRYPT PASSWORD '''

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    hashed = hashed.decode('utf-8') 

    ''' Put hashed as string into database '''
    sqlCommand = f"INSERT INTO `caregivers` (name, password, username) VALUES ('{name}', '{hashed}', '{username}')"
    mycursor.execute(sqlCommand)
    mydb.commit()
    mycursor.execute("SELECT LAST_INSERT_ID()")
    caregiverUserId = mycursor.fetchone()[0]
    return {'caregiverUserId': caregiverUserId}

def authenticateCaregiver(username, password):
    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='users'
    )

    mycursor = mydb.cursor()

    sqlCommand = f"SELECT * FROM `caregivers` WHERE username= '{username}' "

    mycursor.execute(sqlCommand)
    hashed = mycursor.fetchone()[2]
    hashed = hashed.encode('utf-8')
    result = bcrypt.checkpw(password.encode('utf-8'), hashed)
    return {'status': result}

def getElderlyProfile(userId):
    ''' READ REPLICA '''
    mydb = mysql.connector.connect(
        host="192.168.0.125",
        user="root",
        password=SQL_PASSWORD,
        database='users'
    )
    mycursor = mydb.cursor()

    sqlCommand = f"SELECT * FROM `elderly` WHERE userId = {userId} "
    mycursor.execute(sqlCommand)
    result = mycursor.fetchone()
    if result == None:
        return {}
    else:
        return {
            'userId': result[0],
            'name': result[1],
            'age': result[2],
            'caregiverUserId': result[3],
            'height': result[4],
            'weight': result[5],
            'bmi': result[6],
            'gender': result[7]
        }

def getCaregiverProfile(username):
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='users'
    )
    mycursor = mydb.cursor()

    ''' GET CAREGIVER INFORMATION ''' 
    sqlCommand = f"SELECT * FROM `caregivers` WHERE username = '{username}' "
    mycursor.execute(sqlCommand)
    result = mycursor.fetchone()
    
    if result == None:
        return {}
    else:
        sqlCommand = f"SELECT * FROM `elderly` WHERE caregiverUserId = {result[0]}"
        mycursor.execute(sqlCommand)
        elderly = mycursor.fetchone()
        res = {
            'caregiverUserId': result[0],
            'name': result[1],
            'username': result[3],
            'elderlyInfo': {}
        }
        if elderly is not None:
            res['elderlyInfo'] = getElderlyProfile(elderly[0])
        return res

if __name__ == '__main__':
    #id = createCaregiver('daren', 'testing')['caregiverUserId']
    #print(authenticateCaregiver(id, 'test'))
    #print(authenticateCaregiver(id, 'testing'))
    #userId = createElderly('glenda', 18, id)['userId']
    #print(getElderlyProfile(userId))
    #mycursor.execute("SELECT * FROM `caregivers`")
    #print(mydb)

    cmd = f"ALTER TABLE `caregivers` ADD COLUMN `username` TEXT NULL AFTER `password`"
    mydb = mysql.connector.connect(
        host="192.168.0.27",
        user="root",
        password=SQL_PASSWORD,
        database='users'
    )

    mycursor = mydb.cursor()
    mycursor.execute(cmd)
    mydb.commit()
    

