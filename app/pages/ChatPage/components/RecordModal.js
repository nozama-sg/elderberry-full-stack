import React, { useState, useEffect } from 'react';
import { Icon, Box, Text, Heading, Center, VStack, HStack, Button } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

import { postVoiceMsg } from '../../../utils';
import { useStore } from 'react-redux';

const milisToTimestr = (milis) => {
    let mins = (Math.trunc((milis / 1000) / 60)).toString()
    let s = (Math.trunc(milis / 1000) - (mins * 60)).toString()
    return `${mins.length == 1 ? '0' + mins : mins}:${s.length == 1 ? '0' + s : s}`
}

const RecordModal = ({ setRecordModalVisible }) => {
    const [sound, setSound] = useState();
    const [soundObject, setSoundObject] = useState()
    const [recording, setRecording] = useState();
    const [recordFilePath, setRecordFilePath] = useState('')

    const [timeProgress, setTimeProgress] = useState(0)
    const [isSending, setIsSending] = useState(false)

    const store = useStore()

    useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    async function playSound() {
        if (recordFilePath !== null) {
            const { sound: soundObj, status } = await Audio.Sound.createAsync(
                {
                    uri: recordFilePath,
                },
                { shouldPlay: true },
                ({ durationMillis, positionMillis }) => {
                    if (positionMillis != undefined && positionMillis != 0) {
                        setTimeProgress(durationMillis - positionMillis)
                        console.log(durationMillis, positionMillis)

                        if (positionMillis === durationMillis) {
                            setTimeProgress(durationMillis)
                        }
                    }
                }
            )

            soundObj.playAsync()
            setSoundObject(soundObj)
        }
    }

    async function pauseSound() {
        if (soundObject != undefined) {
            await soundObject.pauseAsync()
        }
    }

    async function onStartRecord() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');

            const { recording } = await Audio.Recording.createAsync(
                {
                    android: { extension: '.wav' },
                    ios: { extension: ".wav" }
                },
                ({ durationMillis }) => {
                    setTimeProgress(durationMillis)
                }
            );
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function onStopRecord() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordFilePath(uri)
        console.log('Recording stopped and stored at', uri);
    }

    async function deleteRecord() {
        setSoundObject()
        setRecordFilePath('')
        setSoundObject()
        FileSystem.deleteAsync(recordFilePath)
            .then(res => {
                setTimeProgress(0)
            })
            .catch(e => {
                console.log(e)
            })
    }

    async function sendRecord() {
        if (recordFilePath != undefined) {
            setIsSending(true)

            FileSystem.readAsStringAsync(recordFilePath, {
                encoding: 'base64'
            })
                .then(async (b64Str) => {
                    console.log(b64Str)
                    let response = await postVoiceMsg(store.getState().userInfo.elderlyId, b64Str)
                    console.log(response, 'sent voice message response')

                    setIsSending(false)

                    setRecordModalVisible(false)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }

    return (
        <Box
            h="100%"
            justifyContent="center"
            alignItems="center"
        >
            <Box position='absolute'
                zIndex={2}
                h="100%">
                <Box
                    justifyContent="center"
                    alignItems="center"
                    width="350px"
                    height="300px"
                    bg="white"
                    shadow={2}
                    top="150px"
                >
                    <Heading>Record Message</Heading>
                    <Text>{milisToTimestr(timeProgress)}</Text>
                    <Icon
                        as={Ionicons}
                        name="close-outline"
                        size="sm"
                        position='absolute'
                        right='3'
                        top="2"
                        onPress={() => { setRecordModalVisible(false) }}
                    />

                    <VStack w="85%">
                        <Center>
                            <Box
                                w="100%"
                                flexDir="row"
                                justifyContent="space-between"
                                px={2} py={1} mt={3}
                            >
                                <Button
                                    leftIcon={<Icon as={Ionicons} name="mic-outline" size="sm" mr={-2} />}
                                    onPress={onStartRecord}
                                    variant="outline" colorScheme='purple' width="48%">Record</Button>
                                <Button
                                    leftIcon={<Icon as={Ionicons} name="stop-circle-outline" size="sm" mr={-1} />}
                                    onPress={onStopRecord}
                                    variant="outline" colorScheme='purple' width="48%">Stop </Button>
                            </Box>

                            <Box
                                w="100%"
                                flexDir="row"
                                justifyContent="space-between"
                                px={2} py={1}
                            >
                                <Button
                                    leftIcon={<Icon as={Ionicons} name="play-circle-outline" size="sm" mr={-1} />}
                                    onPress={playSound}
                                    variant="outline" width="48%">Play</Button>
                                <Button
                                    leftIcon={<Icon as={Ionicons} name="pause-circle-outline" size="sm" mr={-1} />}
                                    onPress={pauseSound}
                                    variant="outline" width="48%">Pause</Button>
                            </Box>

                            <HStack px={2} py={1}>
                                <Button
                                    leftIcon={<Icon as={Ionicons} name="trash-outline" size="sm" />}
                                    onPress={deleteRecord}
                                    variant="outline" colorScheme='red' width="100%">Delete</Button>
                            </HStack>

                            <HStack px={2} py={1}>
                                <Button
                                    isLoading={isSending}
                                    leftIcon={<Icon as={Ionicons} name="send-outline" size="sm" />}
                                    onPress={sendRecord}
                                    colorScheme='green' width="100%">Send</Button>
                            </HStack>
                        </Center>
                    </VStack >
                </Box>
            </Box>
        </Box >
    )
}

export default RecordModal