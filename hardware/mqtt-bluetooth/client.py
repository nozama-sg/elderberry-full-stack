import paho.mqtt.client as paho
import sys
import time
import datetime
import json
import requests
import userpass

mqttServerIP = 'localhost'
# mqttServerIP = '192.168.1.104'

client_userData = {
    "userId": 230,
    "deviceName": "apple:1005:9-24",
    #"deviceName": "iBeacon:c80c71ef-1086-4601-9dc1-c83eadb4be7c-0-0",
    "bluetoothUpdateURL": "http://119.13.104.214:80/locationUpdate",
    "updateDelayTime": 30,
    "timeOut": 60,
    "lastLog": datetime.datetime.now(),
    "previousBaseStation": "",
    "valuesDict": {}
}

def onMessage(client, userdata, message):
    baseStation = message.topic.split('/')[-1]
    message = json.loads(message.payload.decode())
    deviceId = message['id']

    rssi = message['rssi']
    mac = message['mac']

    if deviceId == userdata["deviceName"]:
        userdata["lastLog"] = datetime.datetime.now()
        # print(f"LOG: {baseStation}:{deviceId} | RSSI: {rssi} | MAC: {mac}")

        userdata["valuesDict"][baseStation] = rssi
        # print(userdata["valuesDict"])

        # get key in valuesDict with highest value
        maxBaseStation = max(userdata["valuesDict"], key=userdata["valuesDict"].get)
        
        # print(maxBaseStation)
        
        if maxBaseStation != userdata["previousBaseStation"]:
            print(f"{datetime.datetime.now().strftime('%x %X')}: CHANGE: Updating server from {userdata['previousBaseStation']} to {maxBaseStation}....")
            
            data = {
                "userId": userdata["userId"],
                "roomName": maxBaseStation,
            }

            response = requests.post(userdata['bluetoothUpdateURL'], json=data)
            if response.status_code != 200:
                print(f"ERROR: {response.status_code} | {response.text}")
            else:
                print(f"Updated server userId {data['userId']} with {data['roomName']}")
        else:
            print(f"{datetime.datetime.now().strftime('%x %X')}: No change | {maxBaseStation} | {userdata['valuesDict']}")

        userdata["previousBaseStation"] = maxBaseStation
        # time.sleep(userdata["updateDelayTime"])

    elif (datetime.datetime.now() - userdata["lastLog"]).seconds > userdata["timeOut"] and userdata["previousBaseStation"] != "Outside":
        print(f"No device found for {userdata['timeOut']} seconds. Assuming that device is outside. Updating server...")

        data = {
            "userId": userdata["userId"],
            "roomName": "Outside",
        }

        response = requests.post(userdata['bluetoothUpdateURL'], json=data)
        if response.status_code != 200:
            print(f"ERROR: {response.status_code} | {response.text}")
        else:
            print(f"Updated server userId {data['userId']} with {data['roomName']}")

        userdata['previousBaseStation'] = "Outside"
        userdata['lastLog'] = datetime.datetime.now()
        # time.sleep(userdata["updateDelayTime"])
        # note: since there currently are issues with the timedelay, it is alternatively possible 
        # to check the differences in rssi strength to determine whether to update server or not.
    
def onLog(client, userdata, level, buf):
    print(f"LOG: {buf}")

def onConnect(client, userdata, level, flag):
    print("Connected to MQTT server")

client = paho.Client("RPi Client", userdata=client_userData)
client.username_pw_set(userpass.user, userpass.password)
client.on_message = onMessage
client.on_connect = onConnect
#client.on_log = onLog

if client.connect(mqttServerIP, 1883) != 0:
    print("Could not connect to MQTT Broker")
    sys.exit(-1)

client.subscribe(f"espresense/devices/#")

try:
    print("Press CTRL+C to exit....")
    client.loop_forever()
    print('ok')
except:
    print("Disconnecting from broker")

client.disconnect()
