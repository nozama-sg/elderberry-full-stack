# MQTT-Bluetooth
This folder contains the code for the MQTT Bluetooth Client running on the Raspberry Pi.

Using Paho MQTT, `client.py` subscribes to the local MQTT Mosquitto server running on the Pi.

Comparing the reported RSSI Strengths of the Huawei Smartwatch with the ESP32 Bluetooth Beacons, our code derives the closest beacon, and POSTS it to the Huawei Cloud ECS Instance to update the current room the elderly is in.

## ESP32 Bluetooth Beacons
These ESP32s are loaded with [ESPresense](https://github.com/ESPresense/ESPresense) v2.0.34, and communicate to the Pi via MQTT.