import React, { useState, useEffect, useRef } from "react";
import { Center, Box, Icon, Text, Spinner } from "native-base";

import Ionicons from "react-native-vector-icons/Ionicons";

import * as FileSystem from "expo-file-system";

import { useStore } from "react-redux";

const ChatBubble = ({ chatText, date, isMe, audioFile, soundObject }) => {
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async () => {
    try {
      if (!isPlaying) {
        setAudioLoading(true);
        await FileSystem.downloadAsync(
          audioFile,
          FileSystem.documentDirectory + "audio.wav"
        );

        await soundObject.loadAsync({
          uri: FileSystem.documentDirectory + "audio.wav",
        });

        setIsPlaying(true);
        soundObject.playAsync().then((res) => {
          const time = res.durationMillis;
          // Cheater way to stop audio
          setTimeout(() => {
            setIsPlaying(false);
            soundObject.unloadAsync();
          }, time);
        });
      } else {
        soundObject.pauseAsync();
        setIsPlaying(false);
        soundObject.unloadAsync();
      }
      setAudioLoading(false);
    } catch (e) {
      setAudioLoading(false);
    }
  };

  return (
    <Box
      bg={isMe ? "green.200" : "gray.200"}
      alignSelf={isMe ? "flex-end" : "flex-start"}
      w="140px"
      px={2}
      pt={2}
      pb={6}
      borderRadius={10}
      my={3}
      mx={2}
    >
      <Text>{chatText}</Text>
      <Text
        position="absolute"
        bottom="1"
        left={2}
        fontSize="2xs"
        color="gray.500"
      >
        {date}
      </Text>

      {audioLoading && <Spinner position="absolute" bottom={0} right="1" />}

      {audioFile && (
        <Icon
          as={Ionicons}
          name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
          size="sm"
          position="absolute"
          right="1"
          bottom={0}
          onPress={async () => {
            await playAudio();
          }}
        />
      )}
    </Box>
  );
};

const ChatReplies = ({ chats, soundObject }) => {
  const store = useStore();
  const userId = store.getState().userInfo.elderlyId;
  let prevDate = "";

  return (
    <Box w="400px">
      {chats ? (
        chats.map(({ author, timestamp, audioLink, text }) => {
          let showDate = false;
          if (prevDate != timestamp.slice(0, 10)) {
            showDate = true;
            prevDate = timestamp.slice(0, 10);
          }

          return (
            <>
              <Center>
                <Box
                  borderRadius={10}
                  w="120px"
                  textAlign="center"
                  bg="gray.200"
                  mt={4}
                >
                  <Text fontSize="xs" textAlign="center">
                    {timestamp.slice(0, 10)}
                  </Text>
                </Box>
              </Center>

              <ChatBubble
                date={timestamp.slice(12)}
                audioFile={audioLink}
                chatText={text}
                isMe={author === "caregiver"}
                soundObject={soundObject}
              />
            </>
          );
        })
      ) : (
        <Text textAlign="center" fontSize="sm" color="gray.500" my={4}>
          No messages. Start your conversation now!
        </Text>
      )}
    </Box>
  );
};

export default ChatReplies;
