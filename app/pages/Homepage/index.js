import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  Box,
  Center,
  HStack,
  VStack,
  Pressable,
  ScrollView,
} from "native-base";
import { RefreshControl } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useStore } from "react-redux";

// Cards
import HeartCard from "./components/HeartCard";
import StepsCard from "./components/StepsCard";
import SleepTime from "./components/SleepCard";
import FoodCard from "./components/FoodCard";
import RoomCard from "./components/RoomCard";
import AnomalyCard from "./components/AnomalyCard";

// Pages
import HeartRatePage from "../activityPages/HeartPage";
import StepcountPage from "../activityPages/StepcountPage";
import SleepPage from "../activityPages/SleepPage";
import MealPage from "../activityPages/MealPage";

// Utils
import {
  dateToStr,
  getData,
  getLastmeal,
  getLocation,
  getAnomalies,
} from "../../utils";

const HomeStack = createNativeStackNavigator();

let HomePageContent = ({ navigation }) => {
  const store = useStore();

  const [dateNow, setDateNow] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const getAllData = async () => {
    store.dispatch({ type: "refresh" });

    let heartRateData = await getData(
      "heartRate",
      "D",
      store.getState().userInfo.elderlyId
    );
    if (heartRateData.success) {
      store.dispatch({
        type: "update/heartData/D",
        payload: { data: heartRateData.data },
      });
    }

    // DEMO LIVE
    setInterval(async () => {
      let stepData = await getData(
        "stepCount",
        "D",
        store.getState().userInfo.elderlyId
      );
      if (stepData.success) {
        store.dispatch({
          type: "update/stepData/D",
          payload: { data: stepData.data },
        });
      }

      let locData = await getLocation(store.getState().userInfo.elderlyId);
      if (locData.success) {
        store.dispatch({
          type: "update/currentLocation",
          payload: {
            room: locData.data.roomName,
            timeSpent: locData.data.timespent,
          },
        });
      }

      let mealData = await getLastmeal(store.getState().userInfo.elderlyId);
      if (mealData.success) {
        store.dispatch({
          type: "update/lastMealData",
          payload: {
            data: { ...mealData.data },
          },
        });
      }
    }, 1000);

    let sleepData = await getData(
      "sleepSeconds",
      "D",
      store.getState().userInfo.elderlyId
    );
    if (sleepData.success) {
      store.dispatch({
        type: "update/sleepData/D",
        payload: { data: sleepData.data },
      });
    }

    let sleepDataW = await getData(
      "sleepSeconds",
      "W",
      store.getState().userInfo.elderlyId
    );
    if (sleepDataW.success) {
      store.dispatch({
        type: "update/sleepData/W",
        payload: { data: sleepDataW.data },
      });
    }

    let anomalyData = await getAnomalies(store.getState().userInfo.elderlyId);
    if (anomalyData.success) {
      anomalyData.data.map(({ healthInfoType, anomalies }) => {
        store.dispatch({
          type: "update/anomaly",
          payload: {
            healthInfoType,
            anomalies,
          },
        });
      });
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getAllData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    setInterval(() => {
      setDateNow(dateToStr(new Date()));
    }, 1000);
  }, []);

  return (
    <Center>
      <ScrollView
        w="100%"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <VStack
          w="100%"
          border
          height="100%"
          paddingX={3}
          paddingY={3}
          space={3}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Box w="100%" rounded="md" shadow={3}>
            <AnomalyCard />
          </Box>

          <Pressable
            w="100%"
            rounded="md"
            shadow={3}
            onPress={() => {
              navigation.navigate("Heart Rate");
            }}
          >
            <HeartCard />
          </Pressable>

          <Box w="100%" rounded="md" shadow={3}>
            <RoomCard />
          </Box>

          <HStack width="100%" justifyContent="space-between" height="150px">
            <Pressable
              w="180"
              rounded="md"
              shadow={3}
              height="100%"
              onPress={() => {
                navigation.navigate("Step Count");
              }}
            >
              <StepsCard />
            </Pressable>
            <Pressable
              w="180"
              rounded="md"
              shadow={3}
              height="100%"
              onPress={() => {
                navigation.navigate("Sleep");
              }}
            >
              <SleepTime />
            </Pressable>
          </HStack>
          <Pressable
            w="100%"
            rounded="md"
            onPress={() => {
              navigation.navigate("Meals");
            }}
          >
            <FoodCard refresh={getAllData} />
          </Pressable>
        </VStack>
      </ScrollView>
    </Center>
  );
};

const HomePage = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomePageContent} />
      <HomeStack.Screen name="Heart Rate" component={HeartRatePage} />
      <HomeStack.Screen name="Step Count" component={StepcountPage} />
      <HomeStack.Screen name="Sleep" component={SleepPage} />
      <HomeStack.Screen name="Meals" component={MealPage} />
    </HomeStack.Navigator>
  );
};

export default HomePage;
