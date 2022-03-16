from hctools import users, announcements, bluetooth, healthInfo, reports, food
from dateutil.relativedelta import relativedelta
from datetime import datetime, timedelta, date
from uuid import uuid4
from numpy.random import rand, normal
from random import choice
from progress.bar import Bar

def randrange(low, high):
    tx = rand()
    return low + tx * (high-low)

def generateReport(activityStatus, indoorStatus, sleepStatus):
    ''' CREATE CAREGIVER '''
    caregiverUserId = users.createCaregiver('Demonstration User', 'Nullpassword', f'{uuid4()}')['caregiverUserId']
    #caregiverUserId = users.createCaregiver('Demonstration User', 'Nullpassword', 'ElizabethKhua69')['caregiverUserId']
    print(f"caregiverUserId: {caregiverUserId}")

    ''' CREATE ELDERLY '''
    elderlyUserId = users.createElderly('Cedric Khua', 78, caregiverUserId, 170, 65, 22.49, 'male')['userId']
    print(f"elderlyUserId: {elderlyUserId}")

    ''' REPORT '''
    reportUUID = uuid4()
    reports.generateReport(reportUUID, elderlyUserId)
    print("REPORT URL: ", f'http://119.13.104.214:80/getReport/{reportUUID}')

    ''' FOOD DATA ''' 
    print("GENERATING MEALS DATA")
    foodItems = {
            'protein': {'chicken': 14, 'pork': 4, 'beef': 2, 'wanton': 2, 'fish': 5},
            'vegetables': {'xiaobaicai': 1, 'spinach': 1, 'choysum': 1, 'beans': 1},
            'grain': {'rice': 14, 'noodles': 8, 'bread': 19},
            'dessert': {'chendol': 5, 'grassjelly': 3, 'redbean': 2},
            'dairy': {'cheese': 2, 'milk': 6, 'soyabean': 5},
            'fruit': {'watermelon': 2, 'apple': 6, 'grapes': 4, 'banana': 1}
    }

    foodGroupWeights= {
            'fruit': 15, 'dessert': 15, 'grain': 14, 'vegetables': 20, 'dairy': 12, 'protein': 13
    }

    foodGroupOptions = []
    for i in foodGroupWeights: 
        foodGroupOptions += ([i] * foodGroupWeights[i])

    now = datetime.now()
    initDate = datetime(now.year, now.month, 1, 0, 0, 0)
    endDate = datetime(now.year, now.month, 1, 0, 0, 0) + relativedelta(months = 1) - timedelta (seconds=1)
    bar = Bar("Processing...", max=31)
    
    while initDate < endDate:
        mealTimes = [7, 13, 19]
        mealGroups = [2, 3, 3]
        timestamp = initDate.strftime("%Y-%m-%d %H:%M:%S")
        for i in range(3): # For each meal of the day
            imgId = food.mockMeal(elderlyUserId, timestamp)
            while initDate.hour < mealTimes[i]: initDate += timedelta(hours = 1)
            for x in range(mealGroups[i]): # For each food group
                # Choose the food group
                foodGroup = choice(foodGroupOptions)
                opt = [] # WEIGHTED LIST OF OPTIONS
                d = foodItems[foodGroup]
                for j in d:
                    for w in range(d[j]): opt.append(j)
                foodItem = choice(opt)
                # INSERT
                food.addFoodGroup(imgId, foodItem, foodGroup)

        assert initDate.hour == 19
        initDate += timedelta(hours = 5)
        bar.next()


    ''' GENERATING HEALTH SIGNALS '''
    now = datetime.now()
    endDate = datetime(now.year, now.month, 1, 0, 0, 0) + relativedelta(months = 1) - timedelta (seconds=1)
    initDate = endDate - relativedelta(years=1)
    print("GENERATING HEALTH DATA")

    bar = Bar("Processing...", max=365)
    day = 1
    while initDate < endDate:
        ''' CREATE SQL UPDATES '''
        timestr = (initDate+ timedelta(seconds = randrange(0, 7200))).strftime("%Y-%m-%d, %H:%M:%S")
        healthInfo.updateHealthInformation('heartRate', elderlyUserId, normal(75,5), timestr)
        healthInfo.updateHealthInformation('stepAsymmetry', elderlyUserId, normal(4,0.5), timestr)
        if sleepStatus == 2:
            healthInfo.updateHealthInformation('sleepSeconds', elderlyUserId, normal(8*3600, 500), timestr)
        elif sleepStatus == 1:
            healthInfo.updateHealthInformation('sleepSeconds', elderlyUserId, normal(7*3600, 2500), timestr)
        else:
            healthInfo.updateHealthInformation('sleepSeconds', elderlyUserId, normal(6*3600, 6000), timestr)
        
        ''' STEP COUNT '''
        if activityStatus== 2:
            healthInfo.updateHealthInformation('stepCount', elderlyUserId, normal(1125, 125), timestr)
        elif activityStatus == 1:
            healthInfo.updateHealthInformation('stepCount', elderlyUserId, normal(1000, 75), timestr)
        else:
            healthInfo.updateHealthInformation('stepCount', elderlyUserId, normal(500, 25), timestr)
        
        ''' UPDATE DATE AND PROGRESS BAR'''
        initDate = initDate + timedelta(hours=24)
        day += 1
        bar.next()
    print()
    print("HEALTH DATA COMPLETE")

    ''' GENERATE BLUETOOTH FOR ROOMS '''
    initDate = datetime(now.year, now.month, 1, 0, 0, 0)
    endDate = datetime(now.year, now.month, 1, 0, 0, 0) + relativedelta(months = 1) - timedelta (seconds=1)
    ROOM = 'Bedroom'
    roomlist = ['Outside', 'Living Room', 'Bedroom', 'Bathroom', 'Kitchen']

    print("GENERATING BLUETOOTH ROOM DATA")
    bar = Bar("Processing...", max=31)
    day = 1
    cooldown = False

    while initDate < endDate:
        if initDate.day > day:
            day += 1
            bar.next()
            cooldown = False

        ''' GO TOILET '''
        if randrange(1,10) <= 5 or initDate.hour >= 16 and randrange(1,10) <= 8:
            timestr = initDate.strftime("%Y-%m-%d, %H:%M:%S")
            bluetooth.locationUpdate(elderlyUserId, "Bathroom", timestr)
            initDate += timedelta(minutes = randrange(4, 8))
            timestr = initDate.strftime("%Y-%m-%d, %H:%M:%S")
            bluetooth.locationUpdate(elderlyUserId, ROOM, timestr)
            initDate += timedelta(minutes = normal(60, 10), seconds = 1)
            continue

        ''' SLEEP ''' 
        if initDate.hour >= 20 or initDate.hour < 7:
            if ROOM != 'Bedroom':
                timestr = initDate.strftime("%Y-%m-%d, %H:%M:%S")
                bluetooth.locationUpdate(elderlyUserId, "Bedroom", timestr)
                ROOM = "Bedroom"
            initDate = initDate + timedelta(minutes = normal(640, 30), seconds=1)
            continue
        
        ''' TIME TO GO OUT '''
        if initDate.hour >= 11 and initDate.hour <= 19 and not cooldown:
            x = 5
            if indoorStatus == 2: x = 8
            if indoorStatus == 0: x = 2
            if randrange(1,12) <= x:
                timestr = initDate.strftime("%Y-%m-%d, %H:%M:%S")
                bluetooth.locationUpdate(elderlyUserId, "Outside", timestr)
                initDate += timedelta(minutes = normal(180, 50), seconds=1)
                timestr = initDate.strftime("%Y-%m-%d, %H:%M:%S")
                bluetooth.locationUpdate(elderlyUserId, "Living Room", timestr)
                ROOM = "Living Room"
                cooldown = True
                initDate += timedelta(minutes = normal(60, 10), seconds = 1)
                continue

        ''' RANDOM ROOM CHANGE '''
        if randrange(1,8) <= 7:
            rooms = ['Living Room'] * 10 + ['Kitchen'] * 10 + ['Bedroom']
            ''' REDUCE CHANCE OF GOING TO BEDROOM '''
            rooms = [i for i in rooms if i != ROOM]
            target = choice(rooms)
            timestr = initDate.strftime("%Y-%m-%d, %H:%M:%S")
            bluetooth.locationUpdate(elderlyUserId, target, timestr)
            ROOM = target
            initDate += timedelta(minutes = normal(60, 10), seconds = 1)

    print()
    print("BLUETOOTH ROOM DATA COMPLETE")

    print("GENERATING CONVERSATION DATA")
    initDate = datetime(now.year, now.month, 1, 0, 0, 0)
    endDate = datetime(now.year, now.month, 1, 0, 0, 0) + relativedelta(months = 1) - timedelta (seconds=1)

    bar = Bar("Processing...", max=31)
    day = 1
    while initDate < endDate:
        elderlyMessages = 1
        x = normal(1,0.25)
        if x > 1.25: elderlyMessages = 2
        if x < 0.75: elderlyMessages = 0

        caregiverMessages = 1
        initDate = initDate + timedelta(hours = 8)
        left = 16

        for i in range(elderlyMessages):
            announcements.mockElderlyMessage(elderlyUserId, initDate.strftime("%Y-%m-%d %H:%M:%S"), normal(0.7, 0.1))
            initDate = initDate + timedelta(hours = 3)
            left -= 3

        for i in range(caregiverMessages):
            announcements.mockCaregiverMessage(elderlyUserId, initDate.strftime("%Y-%m-%d %H:%M:%S"))
            initDate = initDate + timedelta(hours = 3)
            left -= 3

        ''' UPDATE DATE AND PROGRESS BAR'''
        initDate = initDate + timedelta(hours=left)
        day += 1
        bar.next()
    print("CONVERSATION DATA COMPLETE")

    return {
        'caregiverUserId': caregiverUserId,
        'elderlyUserId': elderlyUserId,
        'url': f'http://119.13.104.214:80/getReport/{reportUUID}'
    }

if __name__ == '__main__':
    print(generateReport())
