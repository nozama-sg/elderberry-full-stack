import React, { useEffect, useState } from "react";
import {} from "react-native";
import {
  Text,
  Box,
  Heading,
  Avatar,
  Center,
  HStack,
  ScrollView,
  Button,
} from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { connect, useStore } from "react-redux";

import InfoCard from "./InfoCard";

import { getUserInfo } from "../../utils";

const ProfileStack = createNativeStackNavigator();

let ProfilePageConts = ({ myInfo, elderlyInfo, updateEInfo, username }) => {
  useEffect(() => {
    getUserInfo(username).then((res) => {
      if (res.success) {
        for (let prop in res.msg.elderlyInfo) {
          updateEInfo(prop, res.msg.elderlyInfo[prop]);
        }
      }
    });
  }, []);

  return (
    <ScrollView w="100%">
      <Box>
        <Box m={2}>
          <Center
            py={5}
            shadow={2}
            bg={{
              linearGradient: {
                colors: ["lightBlue.300", "violet.800"],
                start: [1, 1],
                end: [1, 0],
              },
            }}
          >
            <Avatar
              source={{
                uri: "https://media.istockphoto.com/photos/portrait-of-a-senior-chinese-man-picture-id1132394909?k=20&m=1132394909&s=612x612&w=0&h=EKZAEsO3RoJ8lLa176o_49JinrZGB-1dmL1pRV3PGZk=",
              }}
              size="2xl"
            ></Avatar>

            <Heading mt={3} color="white">
              {elderlyInfo.name}
            </Heading>
          </Center>

          {/* Senior section */}
          <Box mt={2}>
            <InfoCard label="Senior Name" data={elderlyInfo.name} />
            <InfoCard label="Senior Age" data={elderlyInfo.age} />
            <InfoCard
              label="Senior BMI"
              data={(
                elderlyInfo.weight /
                ((elderlyInfo.height / 100) * (elderlyInfo.height / 100))
              ).toFixed(2)}
            />
            <InfoCard label="Gender" data={elderlyInfo.gender || "M"} />
            <InfoCard
              label="Senior Height"
              data={elderlyInfo.height || 173}
              unit="cm"
            />
            <InfoCard
              label="Senior Weight"
              data={elderlyInfo.weight || 68}
              unit="kg"
            />
          </Box>

          {/* Caregiver section */}
          <Box mt={2}>
            <InfoCard label="Caregiver Name" data={myInfo.name} />
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};

const mapStateToProps = (state) => {
  return {
    elderlyInfo: state.elderlyInfo,
    myInfo: state.userInfo,
    username: state.userInfo.username,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateEInfo: (key, data) => {
      dispatch({
        type: "update/elderlyInfo",
        payload: {
          key,
          data,
        },
      });
    },
  };
};

ProfilePageConts = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePageConts);

const ProfilePage = () => {
  let store = useStore();
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        component={ProfilePageConts}
        name="Profile"
        options={({ navigation }) => ({
          headerRight: () => (
            <Button
              variant="ghost"
              size="sm"
              onPress={() => {
                store.dispatch({
                  type: "logout",
                });
              }}
            >
              Logout
            </Button>
          ),
        })}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfilePage;
