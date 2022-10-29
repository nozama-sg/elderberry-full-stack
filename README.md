# Update : We won second place 🥳 🥳 🥳
📺 Watch our presentation [here](https://www.youtube.com/watch?v=kAgrE6Gyluk&t=4860s) <br>

# Contents

[Caregiver App](#elderberry-caregiver-application)

- [📌 Try our app](#try-our-app-)
  - [Try on expo (Recommended)](#try-it-on-expo-recommended) <br>
  - [Local install](#local-installation) <br>
- [Project Info](#project-info)
  - [Tools](#languages--tools)

[Backend Server](#elderberry-backend)

- [Intro](#intro) <br>
- Technical Details
  - [Navigation](#navigating-this-repository) <br>
  - [Tech Stack](#technical-stack) <br>
  - [Db Design](#database-design) <br>
- Try it out!
  - [📌 Report demo](#report-demo)<br>

[Hardware](#elderberry-hardware)

- [Setup](#hardware-setup)
- [Camera Module](#camera-module)
- [Communication Module](#communication-module)
- [Bluetooth Module](#mqtt-bluetooth-module)

[Watch Info](#watch)

<br>

# Elderberry Caregiver Application

- [Try our app](#try-our-app-)
  - [Try on expo (Recommended)](#try-it-on-expo) <br>
  - [Local install](#local-installation-expo) <br>
- [Project Info](#project-info)
  - [Tools](#languages--tools)

---

## Try our app 🧑‍🔬

### Try it on expo (Recommended)

1. Download the expo app

   [On Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_SG&gl=US)

   [On App Store](https://apps.apple.com/us/app/expo-go/id982107779)

2. Create an expo account
3. Open the camera app on your device and scan the code below


    ![Screenshot 2022-03-16 at 11 57 28 PM](https://user-images.githubusercontent.com/59089164/158633417-595216c6-3c4b-4dbb-9269-a2d928a63b68.png)  

  OR click [here](https://expo.dev/@geetee/elderberry)

4. Login with username: RachelKhua, password: Nullpassword

<br>

### Local Installation

1. Download the expo app

   [On Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_SG&gl=US)

   [On App Store](https://apps.apple.com/us/app/expo-go/id982107779)

2. Clone repo

   ```
   $ git clone 'https://github.com/huawei-hackathon/caregiver-app.git'

   $ cd caregiver-app
   ```

3. Yarn install
   ```
   $ yarn
   ```
4. Start expo server
   ```
   $ expo start
   ```
5. Scan QR code on http://localhost:19002
6. Login with username: RachelKhua, password: Nullpassword

<br>

## Project Info

### Languages & tools

#### App building

- [React Native](https://reactnative.dev/) was used to code the application. React Native allows apps written in Javascript to be run on both iOS and Android.

#### Graph plotting

- [Responsive Linechart](https://www.npmjs.com/package/react-native-responsive-linechart) to plot beautiful line charts within project
- [Victory](https://formidable.com/open-source/victory/) for bar charts

#### Other Functionality

- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/) for audio recording and playback
- [React Native Webview](https://github.com/react-native-webview/react-native-webview) to render html reports within the application
- [Axios](https://www.npmjs.com/package/axios) for calling our API server running on Huawei ECS

#### Styling

- [Native Base](https://nativebase.io/) enables clean app design quickly

#### App state management

- [Redux](https://redux.js.org/introduction/getting-started) for app state management
- [React Navigation](https://reactnavigation.org/docs/getting-started) for app navigation

  <br>

# Elderberry-Backend

Try it out!

- [Report demo](#Report-Demo)<br>

## Intro

Repository for Flask server running on Huawei Elastic Cloud Server (ECS). The back-end code manages our large data flows from data analytics and Internet of things and warehouses it on Huawei GaussDB. It the generates reports using open-source tools like Food detection, Sentiment analysis and our own anomaly detection to provide a holistic dashboard that provides caregivers with comprehensive information about elderly health. 

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
Try it out [here](http://elderberry.live) 
[NOTE: This has be depracated as the competition has ended] 

---

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

---

# Watch

This application is coded in Swift, and makes use of HealthKit to post relevant data. Unfortunately none of us own a Huawei Smart watch, and coding an MVP using an Apple watch was our only option. However, we realised Apple was very restrictive in terms of posting data and data is only updated once every 10 minutes. While the application works, we are unable to get it to work in real time using the Apple watch. However, given time and resources, we are confident that we are able to do real time updates using Huawei healthkit, and may even expand to notifications, in-app fall detection, and blood O2 saturation, which are features that are unavailable to developers for the Apple watch.
