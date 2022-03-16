# Elderberry-Hardware
This repository covers the code running on the Raspberry Pi.
This build is in a linux environment (Raspbian) for Raspberry Pi 2B (armv7l)

## Navigating this Repository
Our Hardware Stack contains 3 modules - Bluetooth, Camera, Communication. Each folder contains the relevant code for the module.


## Hardware Setup
<figure>
<img src="readme-assets/raspberry-pi.JPG" alt="Raspberry Pi 2B" style="width:100%">
<figcaption align = "center">The Raspberry Pi 2B used is connected to a Webcam, Speaker, Buttons via GPIO, Ethernet and Power.</figcaption>
</figure>

<figure>
<img src="readme-assets/buttons.JPG" alt="Buttons" style="width:100%">
<figcaption align = "center">The buttons used are generic keyboard switches for this MVP. Buttons make it more straightforward for the elderly to interact with our product. One button is to Record Message, other is to Replay previous message.</figcaption>
</figure>

<figure>
<img src="readme-assets/esp32.JPG" alt="esp32" style="width:100%">
<figcaption align = "center">Each ESP32 Communicates to the Pi via MQTT over WiFi, allowing us to do indoor location positioning via comparison of Bluetooth RSSI.</figcaption>
</figure>

<figure>
<img src="readme-assets/webcam-setup.JPG" alt="Buttons" style="width:100%">
<figcaption align = "center">Using OpenCV, The webcam takes a picture when motion is detected, and uploads the picture to Huawei Cloud for food detection. Webcam used is a Logitech C310.</figcaption>
</figure>

<figure>
<img src="readme-assets/speaker.JPG" alt="Buttons" style="width:100%">
<figcaption align = "center">Generic speaker is connected to the Raspberry Pi for announcements and medicine reminders.</figcaption>
</figure>
