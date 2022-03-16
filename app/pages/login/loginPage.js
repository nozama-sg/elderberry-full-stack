import * as React from "react";
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  Image,
  Center,
} from "native-base";
import { connect } from "react-redux";

import { tryLogin, getUserInfo } from "../../utils";

import { useState } from "react";
import { valPw, valUsername } from "../../utils/helper";
import { StyleSheet } from "react-native";

const LoginArea = (props) => {
  const navigation = props.navigation;
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [errMessageShow, setErrMessageShow] = useState(true);
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);

  let submitHandler = async () => {
    let success = false;

    if (valUsername(username) && valPw(pw)) {
      setLoading(true);
      console.log(username, pw);

      const loginAttempt = await tryLogin(username, pw);
      console.log(loginAttempt);

      if (loginAttempt.success) {
        if (loginAttempt.data.status) {
          let userInfo = await getUserInfo(username);
          console.log(userInfo);

          props.dispatchLogin({
            elderlyInfo: { ...userInfo.data.elderlyInfo },
            name: userInfo.data.name,
            userId: userInfo.data.caregiverUserId,
            elderlyId: userInfo.data.elderlyInfo.userId,
          });

          success = true;
        } else {
          setErrMessage("Invalid login.");
        }
      } else {
        setErrMessage("Server error. Please ensure username is valid.");
      }
    }

    if (!success) {
      setUsername("");
      setPw("");
      setErrMessageShow(true);
    }

    setLoading(false);
  };

  return (
    <Box alignContent="center" justifyContent="center" bg="white" shadow={2}>
      <Image
        opacity={30}
        source={require("../../assets/appicongreen.png")}
        width="350px"
        height="350px"
        position="absolute"
        zIndex={-1}
        top={0}
      />
      <Box
        w="350px"
        h="350px"
        py="6"
        px="10"
        zIndex={3}
        backgroundColor="rgba(255,255,255,0.7)"
      >
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: "warmGray.50",
          }}
        >
          Welcome to Elderberry
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: "warmGray.200",
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs"
        >
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <Input
              onChangeText={(text) => setUsername(text)}
              value={username}
              placeholder="Enter username"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              type="password"
              onChangeText={(text) => setPw(text)}
              value={pw}
              placeholder="Enter password"
            />
          </FormControl>

          {errMessageShow ? (
            <>
              <Text color="red.600">{errMessage}</Text>
            </>
          ) : (
            <Text></Text>
          )}

          <Button
            mt="2"
            onPress={() => {
              submitHandler();
            }}
            isLoading={loading}
          >
            Sign in
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  dispatchLogin: (payload) =>
    dispatch({
      type: "loginAsUser",
      payload: payload,
    }),
});

const styles = StyleSheet.create({
  errModal: {
    position: "absolute",
    top: 0,
  },
});

export default connect(null, mapDispatchToProps)(LoginArea);
