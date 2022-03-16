import React, { useEffect, useState } from "react";
import { Text, Center, Box, View, Button, HStack, Spinner } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WebView } from "react-native-webview";
import { useStore } from "react-redux";

import { getMockReport, getReport } from "../../utils";
import DoctorCode from "./DoctorCode";

const RecordStack = createNativeStackNavigator();

const ReportWebview = ({ src }) => {
  return src != undefined ? <WebView source={{ uri: src }} /> : <></>;
};

const RecordPageCont = () => {
  const store = useStore();
  let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][new Date().getMonth()];

  const [reportUri, setReportUri] = useState("");
  const [codeVisible, setCodeVisible] = useState(false);

  const getUri = async () => {
    let res = await getReport(store.getState().userInfo.elderlyId);
    if (res.success) {
      setReportUri(res.data);
    }
  };

  useEffect(async () => {
    getUri();
  }, []);

  return (
    <>
      {codeVisible && reportUri && (
        <DoctorCode url={reportUri} setVisible={setCodeVisible} />
      )}

      <Box
        position="relative"
        w="100%"
        h="90%"
        zIndex={1}
        opacity={codeVisible ? 30 : 100}
      >
        <Center>
          <HStack justifyContent="center" alignItems="center">
            <Text mt={3} fontSize="lg" color="gray.500">
              Report for:
            </Text>
            <Text bold mt={3} fontSize="xl">
              {" "}
              {month} {new Date().getFullYear()}
            </Text>
          </HStack>

          <Button
            mt={4}
            onPress={() => {
              getUri();
              setCodeVisible(true);
            }}
          >
            Doctor Report
          </Button>
        </Center>

        <Center>
          <Box w="90%" h="95%">
            {reportUri ? (
              <ReportWebview
                automaticallyAdjustContentInsets={false}
                src={reportUri}
              />
            ) : (
              <Spinner />
            )}
          </Box>
        </Center>
      </Box>
    </>
  );
};

let PastRecordPage = () => {
  return (
    <RecordStack.Navigator>
      <RecordStack.Screen component={RecordPageCont} name="Records" />
    </RecordStack.Navigator>
  );
};

export default PastRecordPage;
