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

def generateAnomaly(heartRate, sleepSeconds, stepAsymmetry, stepCount, caregiverUsername):
    indoorStatus = 1 
    activityStatus = 1
    sleepStatus = 1

    ''' CREATE CAREGIVER '''
    caregiverUserId = users.createCaregiver('Demonstration User', 'Nullpassword', caregiverUsername)['caregiverUserId']
    print(f"caregiverUserId: {caregiverUserId}")

    ''' CREATE ELDERLY '''
    elderlyUserId = users.createElderly('Cedric Khua', 78, caregiverUserId, 170, 65, 22.49, 'male')['userId']
    print(f"elderlyUserId: {elderlyUserId}")

    ''' GENERATE BLUETOOTH FOR ROOMS '''
    n = datetime.now()
    initDate = datetime(n.year, n.month, n.day) + relativedelta(months = -1)
    endDate = n
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
            if indoorStatus == 0: x = 7
            if indoorStatus == 2: x = 3
            if randrange(1,12) <= 4:
                timestr = initDate.strftime("%Y-%m-%d, %H:%M:%S")
                bluetooth.locationUpdate(elderlyUserId, "Outside", timestr)
                initDate += timedelta(minutes = normal(180, 50), seconds=1)
                timestr = initDate.strftime("%Y-%m-%d, %H:%M:%S")
                bluetooth.locationUpdate(elderlyUserId, "Living Room", timestr)
                ROOM = "Living Room"
                cooldown = True
                initDate += timedelta(minutes = normal(60, 10), seconds = 1)

    ''' GENERATING HEALTH SIGNALS '''
    n = datetime.now()
    initDate = datetime(n.year, n.month, n.day) + relativedelta(months = -1)
    endDate = n
    print (f"GENERATING DATA FROM {initDate} TO {endDate}")
    print("GENERATING HEALTH DATA")

    bar = Bar("Processing...", max=29)
    day = 1
    heartRateAvg = 70
    daySteps = 0
    today = (n - timedelta(days=1)).day
    while initDate < endDate:
        ''' HEART RATE DATA '''
        timestr = (initDate+ timedelta(seconds = randrange(50,60))).strftime("%Y-%m-%d, %H:%M:%S")
        print(timestr)
        if not heartRate:
            healthInfo.updateHealthInformation('heartRate', elderlyUserId, normal(heartRateAvg,1), timestr)
        else:
            ''' SUDDEN PERMENANT INCREASE IN HEART RATE ''' 
            if initDate.day == today and initDate.hour > 16:
                healthInfo.updateHealthInformation('heartRate', elderlyUserId, normal(heartRateAvg+30,1), timestr)
            else:
                healthInfo.updateHealthInformation('heartRate', elderlyUserId, normal(heartRateAvg,1), timestr)

        ''' STEP ASYMMETRY '''
        if not stepAsymmetry:
            healthInfo.updateHealthInformation('stepAsymmetry', elderlyUserId, normal(5, 0.2), timestr)
        else:
            if initDate.day == today:
                ''' ONE DAY OF HIGH STEP ASYMMETRY '''
                healthInfo.updateHealthInformation('stepAsymmetry', elderlyUserId, normal(8, 0.1), timestr)
            else:
                healthInfo.updateHealthInformation('stepAsymmetry', elderlyUserId, normal(5, 0.2), timestr)

        ''' SLEEP SECONDS (ONLY UPDATED ONCE A DAY)''' 
        if not sleepSeconds:
            if (initDate.hour == 0): healthInfo.updateHealthInformation('sleepSeconds', elderlyUserId, normal(7*3600, 100), timestr)
        else:
            if initDate.day == today:
                ''' LESS SLEEP THAN USUAL '''
                if (initDate.hour == 0): healthInfo.updateHealthInformation('sleepSeconds', elderlyUserId, normal(3*3600, 100), timestr)
            else:
                if (initDate.hour == 0): healthInfo.updateHealthInformation('sleepSeconds', elderlyUserId, normal(7*3600, 100), timestr)
        
        ''' STEP COUNT '''
        if not stepCount:
            ''' No Anomaly '''
            if initDate.hour == 0:
                daySteps = 0 # Resets day steps
            if initDate.hour == 12:
                daySteps += 500
            if initDate.hour == 18:
                daySteps += 1000
            daySteps += normal(200,10)
            healthInfo.updateHealthInformation('stepCount', elderlyUserId, daySteps, timestr)
        else:
            if initDate.hour == 0:
                daySteps = 0 # Resets day steps
            if initDate.hour == 12:
                daySteps += 500
            if initDate.hour == 18 and initDate.day != today:
                daySteps += 1000
            if initDate.hour >= 8 and initDate.hour <= 22:
                daySteps += normal(20,5)
            healthInfo.updateHealthInformation('stepCount', elderlyUserId, daySteps, timestr)
        
        ''' UPDATE DATE AND PROGRESS BAR'''
        initDate = initDate + timedelta(hours=1)
        if initDate.day != day:
            day = initDate.day
            bar.next()

    print()
    print("HEALTH DATA COMPLETE")

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

    print("MEALS DATA COMPLETE")

    return {
        'caregiverUserId': caregiverUserId,
        'elderlyUserId': elderlyUserId
    }

if __name__ == '__main__':
    print(generateAnomaly())
