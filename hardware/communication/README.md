# Communication
This folder contains the code for the communication services running on the Raspberry Pi.

## Announcements
`announce.py` contains code for announcements and scheduled medicine reminders.

Running a local Flask Server, we generate a tunnel using Ngrok which is POST to the Huawei Cloud Server. This allows the Cloud Server to POST new messages and recordings to the pi.

For text announcements, we use gTTS to generate an audio of the announcement. 

Then, both gTTS audio or recorded messages are played with vlc.

### Scheduled Medicine Reminders
We make use of APScheduler and an Sqlite database to store information on medicine reminders, and schedule announcements to remind the Elderly to take their medicine.

## Recordings
`record.py` contains code for the elderly to record messages back to the caregiver. Recordings are triggered by GPIO
