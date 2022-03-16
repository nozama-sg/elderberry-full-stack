import pyaudio
import os
import requests
import base64
import wave
import vlc
import time
import RPi.GPIO as GPIO
from gtts import gTTS

recordingUploadURL = 'http://119.13.104.214:80/recordedElderlyMessage'
userId = 227

# GPIO.setwarnings(True)
GPIO.setmode(GPIO.BOARD)
GPIO.setup([18,7], GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# pyaudio setp
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 2
RATE = 44100

startRecord = False
print("Service started")

while True:
	# RECORD AUDIO BUTTON
	if GPIO.input(18) == GPIO.HIGH:
		print("Button ORANGE pushed")
		startRecord = not startRecord
		time.sleep(1)

	if startRecord == True:
		p = pyaudio.PyAudio()
		stream = p.open(format=FORMAT,
						channels=CHANNELS,
						rate=RATE,
						input=True,
						frames_per_buffer=CHUNK)

		player = vlc.MediaPlayer('recording-started.mp3')
		player.play()

		print("Start recording")
		frames = []

		while startRecord == True:
			data = stream.read(CHUNK)
			frames.append(data)
			if GPIO.input(18) == GPIO.HIGH:
				print("Stopped recording")
				startRecord = not startRecord
				time.sleep(1)
				player = vlc.MediaPlayer('recording-stopped.mp3')
				player.play()

		sample_width = p.get_sample_size(FORMAT)
		stream.stop_stream()
		stream.close()
		p.terminate()
	
		# get the list of files in the directory and fullPath of files
		fileList = os.listdir('recordedMessage')
		fullPath = [f"./recordedMessage/{name}" for name in fileList]

		# remove oldest file
		if len([name for name in fileList]) > 10:
			oldestFile = min(fullPath, key=os.path.getctime)
			os.remove(oldestFile)

		# update list of files in dir and fullpath of files
		fileList = os.listdir('recordedMessage')
		fullPath = [f"./recordedMessage/{name}" for name in fileList]
		
		# determining fileName
		if len([name for name in fileList]) == 0:
				count = 1
		else:
			newestFile = max(fullPath, key=os.path.getctime)
			count = int(newestFile.split('/')[-1].split('.')[0].split('_')[-1]) + 1

		wf = wave.open(f'./recordedMessage/record_{count}.wav', 'wb')
		wf.setnchannels(CHANNELS)
		wf.setsampwidth(sample_width)
		wf.setframerate(RATE)
		wf.writeframes(b''.join(frames))
		wf.close()
		print("Recording saved")

		with open(f"./recordedMessage/record_{count}.wav", 'rb') as file:
			audio = base64.b64encode(file.read())

		data = {
			"userId": userId,
			"audio": audio.decode()
		}

		try:
			response = requests.post(recordingUploadURL, json=data)

			if response.status_code != 200:
				print(f"ERROR: {response.status_code} | {response.text}")
			else:
				print(f"Recording uploaded")

		except:
			print('ERROR: Unable to update server endpoint')


	# PLAY AUDIO BUTTON
	if GPIO.input(7) == GPIO.HIGH:
		print("Button BLACK pushed")
		time.sleep(1)
		
		# get the list of files in the directory and fullPath of messages
		messageFileList = os.listdir('announceMessage')
		audioFileList = os.listdir('announceAudio')

		messageFullPath = [f"./announceMessage/{name}" for name in messageFileList]
		audioFullPath = [f"./announceAudio/{name}" for name in audioFileList]

		latestFile = max(messageFullPath + audioFullPath, key=os.path.getctime)
		print(f"Latest file: {latestFile}")
		extension = latestFile.split('.')[-1]

		if extension == 'txt':
			with open(latestFile) as file:
				text = file.readlines()
			textLines = ''
			for i in text:
				textLines += str(i)
			tts = gTTS(textLines)
			tts.save('announceMessage-tmp.mp3')
			player = vlc.MediaPlayer('announceMessage-tmp.mp3')
			player.play()
			os.remove('announceMessage-tmp.mp3')

		else:
			player = vlc.MediaPlayer(latestFile)
			player.play()
