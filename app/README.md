# Elderberry Caregiver Application

[Try it out](#try-it-out)

- [Try on expo (Recommended)](#try-it-on-expo) <br>
- [Local install](#local-installation-expo) <br>

[Project Info](#project-info)

- [Tools](#languages--tools)
- [Directory structure](#project-structure)

<br>

# Try it out 🧑‍🔬

## Try it on expo (Recommended) 👍

1. Download the expo app

   [On Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_SG&gl=US)

   [On App Store](https://apps.apple.com/us/app/expo-go/id982107779)

2. Create an expo account
3. Open the camera app on your device and scan the code below

   ![qr image](./readme-assets/expo-qr.png)

   OR

   Open this [link](exp://exp.host/@geetee/Elderberry?release-channel=default) on your device

<br>

## Local Installation 💻

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

<br>

# Project Info 🙋

## Languages & tools 🔧

### App building

- [React Native](https://reactnative.dev/) was used to code the application. React Native allows apps written in Javascript to be run on both iOS and Android.

### Graph plotting

- [Responsive Linechart](https://www.npmjs.com/package/react-native-responsive-linechart) to plot beautiful line charts within project
- [Victory](https://formidable.com/open-source/victory/) for bar charts

### Other Functionality

- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/) for audio recording and playback
- [React Native Webview](https://github.com/react-native-webview/react-native-webview) to render html reports within the application
- [Axios](https://www.npmjs.com/package/axios) for calling our API server running on Huawei ECS

### Styling

- [Native Base](https://nativebase.io/) enables clean app design quickly

### App state management

- [Redux](https://redux.js.org/introduction/getting-started) for app state management
- [React Navigation](https://reactnavigation.org/docs/getting-started) for app navigation

  <br>

## Directory Structure 📁

### Pages

Other than general components, components are in silo together within the page that they are used.

```
pages
├── ChatPage
│   ├── components
│   │   ├── RecordModal.js
│   │   └── TextModal.js
│   └── index.js
├── Homepage
│   ├── components
│   │   ├── AnomalyCard
│   │   │   ├── AnomalyPopover.js
│   │   │   └── index.js
│   │   ├── FoodCard
│   │   │   ├── AddButton.js
│   │   │   ├── ContentList.js
│   │   │   ├── EditFoodGroupModal.js
│   │   │   └── index.js
│   │   ├── HeartCard
│   │   │   └── index.js
│   │   ├── RoomCard
│   │   │   └── index.js
│   │   ├── SleepCard
│   │   │   └── index.js
│   │   └── StepsCard
│   │       └── index.js
│   └── index.js
├── activityPages
│   ├── HeartPage
│   │   ├── Chart.js
│   │   └── index.js
│   ├── MealPage
│   │   ├── Datepicker.js
│   │   ├── OnemealComponents.js
│   │   └── index.js
│   ├── SleepPage
│   │   ├── chart.js
│   │   └── index.js
│   └── StepcountPage
│       ├── chart.js
│       └── index.js
├── login
│   ├── index.js
│   └── loginPage.js
├── pastRecord
│   ├── DoctorCode.js
│   └── index.js
├── profile
│   ├── InfoCard.js
│   └── index.js
└── signup.js
```

### Redux

To prevent unnecessary API calls, we used redux to store state with the option for users to refresh data if the need arises. Data is also updated upon entering the app.

```
redux
├── reducer
│   ├── index.js
│   ├── profile.js
│   ├── updateData.js
│   └── updateFoodData.js
├── state.js
└── store.js
```
