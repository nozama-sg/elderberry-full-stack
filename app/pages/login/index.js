import * as React from "react";
import { Center } from "native-base";

import LoginArea from "./loginPage";

function LoginPage(props) {
  let navigation = props.navigation;

  return (
    <Center flex={1} style={{ marginTop: -100 }} bg="green.200">
      <LoginArea navigation={navigation} />
    </Center>
  );
}

export default LoginPage;
