import React, { useState, useEffect } from "react";
import {
  Icon,
  Box,
  Text,
  Heading,
  Center,
  VStack,
  HStack,
  Button,
  TextArea,
  KeyboardAvoidingView,
  ScrollView,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Keyboard, Pressable } from "react-native";
import {
  Gesture,
  GestureDetector,
  Directions,
} from "react-native-gesture-handler";
import { useStore } from "react-redux";

import { announceMessage } from "../../../utils";
import SuccessAlert from "../../../components/SuccessAlert";

const TextModal = ({ setTextModalVisible }) => {
  const [isSending, setIsSending] = useState(false);
  const [inputTxt, setInputTxt] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const store = useStore();

  const sendRecord = async () => {
    if (inputTxt != undefined) {
      setIsSending(true);
      let userId = store.getState().userInfo.elderlyId;

      let res = await announceMessage(userId, inputTxt);
      if (res.success && res.data.status == 200) {
        console.log(res.data);
        setInputTxt("");
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
        console.log("ERROR", res.data);
      }
      setIsSending(false);
    }
  };

  const flingGesture = Gesture.Fling()
    .direction(Directions.DOWN)
    .onEnd((e) => {
      Keyboard.dismiss();
    });

  return (
    <Pressable onPress={Keyboard.dismiss} accessible={false}>
      <Box h="100%" justifyContent="center" alignItems="center">
        {!isSending && isSuccess && (
          <Text bg="green.200">Successfully sent!</Text>
        )}

        {!isSending && !isSuccess && (
          <Text>Failed to send. Try again later.</Text>
        )}

        <Box
          justifyContent="center"
          alignItems="center"
          width="350px"
          height="300px"
          bg="white"
          shadow={2}
          position="absolute"
          top="150px"
        >
          <Heading>Text Message</Heading>

          <Icon
            as={Ionicons}
            name="close-outline"
            size="sm"
            position="absolute"
            right="3"
            top="2"
            onPress={() => {
              setTextModalVisible(false);
            }}
          />

          <Box w="300px" justifyContent="center" alignItems="center">
            <TextArea
              mx="3"
              placeholder="Type message here"
              w="100%"
              h="80px"
              my={4}
              onChangeText={(t) => {
                setInputTxt(t);
              }}
              value={inputTxt}
            />
            <Button
              isLoading={isSending}
              leftIcon={<Icon as={Ionicons} name="send-outline" size="sm" />}
              onPress={sendRecord}
              colorScheme="green"
              width="100%"
            >
              Send
            </Button>
          </Box>

          <GestureDetector gesture={flingGesture}>
            <></>
          </GestureDetector>
        </Box>
      </Box>
    </Pressable>
  );
};

export default TextModal;
