import React, { useState, useEffect, useRef } from "react";
import { Center, Box, Button, Icon, ScrollView, VStack } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";

import { connect } from "react-redux";

import { getConvo } from "../../utils";

import RecordModal from "./components/RecordModal";
import TextModal from "./components/TextModal";
import ChatReplies from "./components/ChatReplies";
import MedicineReminders from "./components/MedicineReminders";

const ChatStack = createNativeStackNavigator();

let ChatComponent = ({ chats, userId, updateChat }) => {
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [textModalVisible, setTextModalVisible] = useState(false);
  const [medicineReminderVisible, setMedicineReminderVisible] = useState(false);

  const [soundObject, setSoundObject] = useState(new Audio.Sound());

  const scrollViewRef = useRef();

  useEffect(() => {
    let chatInterval = setInterval(async () => {
      let res = await getConvo(userId);
      if (res.success) {
        updateChat(res.data);
      } else {
        console.log(res.data);
      }
    }, 1000);
  }, []);

  return (
    <Box>
      {recordModalVisible && (
        <RecordModal setRecordModalVisible={setRecordModalVisible} />
      )}

      {textModalVisible && (
        <TextModal setTextModalVisible={setTextModalVisible} />
      )}

      {medicineReminderVisible && (
        <MedicineReminders
          setMedicineReminderVisible={setMedicineReminderVisible}
        />
      )}

      <Center
        mb={3}
        position="absolute"
        zIndex={-1}
        w="100%"
        opacity={
          recordModalVisible || textModalVisible || medicineReminderVisible
            ? 30
            : 100
        }
      >
        <ScrollView
          w="100%"
          h="550px"
          bg="gray.300"
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {chats && <ChatReplies chats={chats} soundObject={soundObject} />}
        </ScrollView>

        <VStack my={3} w="300px" space={3}>
          <Box flexDir="row" justifyContent="space-between">
            <Button
              w="130px"
              h="50px"
              colorScheme="primary"
              leftIcon={
                <Icon as={Ionicons} name="megaphone-outline" size="sm" />
              }
              onPress={() => {
                setRecordModalVisible(true);
              }}
            >
              Speech
            </Button>

            <Button
              w="130px"
              h="50px"
              colorScheme="primary"
              leftIcon={
                <Icon as={Ionicons} name="phone-portrait-outline" size="sm" />
              }
              onPress={() => {
                setTextModalVisible(true);
              }}
            >
              Text
            </Button>
          </Box>
          <Box>
            {/* TODO: EDIT MEDICINE SCHEDULE FRONTEND */}
            <Button
              onPress={() => {
                setMedicineReminderVisible(true);
              }}
            >
              Edit Medicine Reminders
            </Button>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userInfo.elderlyId,
    chats: state.chat,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateChat: (pl) =>
      dispatch({ type: "update/chat", payload: { data: pl } }),
  };
};

ChatComponent = connect(mapStateToProps, mapDispatchToProps)(ChatComponent);

export default function ChatPage() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen name="Chat" component={ChatComponent} />
    </ChatStack.Navigator>
  );
}
