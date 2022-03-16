# Elderberry-Backend

Try it out!
- [Report demo](#Report-Demo)<br>

## Intro
Repository for Flask server running on Huawei Elastic Cloud Server (ECS). Provides backend routes for Elderberry project and runs Food Detection AI, Sentiment Analysis, Anomaly Detection and the generation of monthly reports.

The monthly report system is hosted at http://119.13.104.214:80/customizeReport.

## Navigating this Repository
The file `app.py` contains the list of all routes. It redirects each set of relavent routes (i.e. bluetooth routes) to the corresponding file in `/routes`, for instance `/routes/bluetooth.py`. That file processes the query and uses `/hctools/bluetooth.py` (hctools referring to Huawei Cloud tools) to invoke GaussDB, OBS or otherwise.

The `/mockData` files help generate mock data for the back-end reports and the front-end app.

## Technical Stack
![This is an image](backend/readme/chart.png)

## Database Design
![This is an image](backend/readme/database.png)

## Report Demo
To demonstrate different kind of reports that can be generated, we created a webpage to try generating the reports for different profiles. This shows the different type of reports that can be made based on the user. <br>
Try it out [here](http://119.13.104.214)

----

# Elderberry-Hardware
This build is in a linux environment (Raspbian) for Raspberry Pi 2B (armv7l)

## Hardware Setup
<figure>
<img src="hardware/readme-assets/raspberry-pi.JPG" alt="Raspberry Pi 2B" style="width:100%">
<figcaption align = "center">The Raspberry Pi 2B used is connected to a Webcam, Speaker, Buttons via GPIO, Ethernet and Power.</figcaption>
</figure>

<figure>
<img src="hardware/readme-assets/buttons.JPG" alt="Buttons" style="width:100%">
<figcaption align = "center">The buttons used are generic keyboard switches for this MVP. Buttons make it more straightforward for the elderly to interact with our product. One button is to Record Message, other is to Replay previous message.</figcaption>
</figure>

<figure>
<img src="hardware/readme-assets/esp32.JPG" alt="esp32" style="width:100%">
<figcaption align = "center">Each ESP32 Communicates to the Pi via MQTT over WiFi, allowing us to do indoor location positioning via comparison of Bluetooth RSSI.</figcaption>
</figure>

<figure>
<img src="hardware/readme-assets/webcam-setup.JPG" alt="Buttons" style="width:100%">
<figcaption align = "center">Using OpenCV, The webcam takes a picture when motion is detected, and uploads the picture to Huawei Cloud for food detection. Webcam used is a Logitech C310.</figcaption>
</figure>

<figure>
<img src="hardware/readme-assets/speaker.JPG" alt="Buttons" style="width:100%">
<figcaption align = "center">Generic speaker is connected to the Raspberry Pi for announcements and medicine reminders.</figcaption>
</figure>

## Camera Module
Photos are taken by OpenCV when motion is detected, before being uploaded.

## Communication Module
### Announcements
`announce.py` contains code for announcements and scheduled medicine reminders.

Running a local Flask Server, we generate a tunnel using Ngrok which is POST to the Huawei Cloud Server. This allows the Cloud Server to POST new messages and recordings to the pi.

For text announcements, we use gTTS to generate an audio of the announcement. 

Then, both gTTS audio or recorded messages are played with vlc.

#### Scheduled Medicine Reminders
We make use of APScheduler and an Sqlite database to store information on medicine reminders, and schedule announcements to remind the Elderly to take their medicine.

### Recordings
`record.py` contains code for the elderly to record messages back to the caregiver. Recordings are triggered by GPIO

## MQTT-Bluetooth Module
This folder contains the code for the MQTT Bluetooth Client running on the Raspberry Pi.

Using Paho MQTT, `client.py` subscribes to the local MQTT Mosquitto server running on the Pi.

Comparing the reported RSSI Strengths of the Huawei Smartwatch with the ESP32 Bluetooth Beacons, our code derives the closest beacon, and POSTS it to the Huawei Cloud ECS Instance to update the current room the elderly is in.

### ESP32 Bluetooth Beacons
These ESP32s are loaded with [ESPresense](https://github.com/ESPresense/ESPresense) v2.0.34, and communicate to the Pi via MQTT.