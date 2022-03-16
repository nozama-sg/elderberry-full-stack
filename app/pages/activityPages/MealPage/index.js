import React, { useState, useEffect } from "react";
import { Dimensions, StatusBar } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import {
  HStack,
  Box,
  Text,
  Center,
  ChevronRightIcon,
  ChevronLeftIcon,
  Pressable,
  Spinner,
} from "native-base";

import { dateToDaysAndTime, getDateMeal } from "../../../utils";
import { MealConts, OneMealImage } from "./OnemealComponents";
import { DatePicker } from "./Datepicker";
import { useStore } from "react-redux";

const initialLayout = {
  width: Dimensions.get("window").width,
};

const MealsNavigation = ({ routes, index, renderSceneObj, setIndex }) => {
  const renderTabBar = () => <></>;

  return (
    <>
      {routes.length === 0 || renderSceneObj.length === 0 ? (
        <></>
      ) : (
        <TabView
          navigationState={{
            index,
            routes,
          }}
          renderScene={SceneMap(renderSceneObj)}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          style={{
            marginTop: StatusBar.currentHeight,
          }}
        />
      )}
    </>
  );
};

const MealPage = () => {
  const [index, setIndex] = useState(0);
  const [mealInfo, setMealInfo] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [loading, setLoading] = useState(false);

  const [dateModalShown, setDateModalShown] = useState(false);
  const [date, setDate] = useState(new Date());

  const [renderSceneObj, setRenderSceneObj] = useState({});
  const [routes, setRoutes] = useState([]);

  const store = useStore();

  const refresh = async () => {
    setLoading(true);

    const mealsInfo = await getDateMeal(
      store.getState().userInfo.elderlyId,
      date.toISOString().slice(0, 10)
    );

    if (mealsInfo.success && mealsInfo.data.length > 0) {
      setIsEmpty(false);

      let mealInfoTmp = [];
      mealsInfo.data.map((mealObj) => {
        mealInfoTmp.push({
          ...mealObj,
        });
      });

      setMealInfo(mealInfoTmp);
    } else {
      setIsEmpty(true);
    }

    setLoading(false);
  };

  useEffect(async () => {
    refresh();
  }, [date]);

  useEffect(() => {
    let routeTmp = [];
    let renderSceneObjTmp = {};

    mealInfo.map((obj) => {
      routeTmp.push({
        key: obj.timestamp,
        title: `${obj.timestamp}-meal`,
      });

      renderSceneObjTmp[obj.timestamp] = () => {
        return <OneMealImage imgUrl={obj.imgUrl} />;
      };
    });

    setRoutes(routeTmp);
    setRenderSceneObj(renderSceneObjTmp);
  }, [mealInfo]);

  return (
    <Box w="100%" justifyContent="center" alignContent="center">
      <Center>
        <DatePicker
          show={dateModalShown}
          setShow={setDateModalShown}
          date={date}
          setDate={setDate}
        />

        {mealInfo.length > 0 && !isEmpty && (
          <>
            <HStack
              zIndex={-1}
              justifyContent="center"
              space={2}
              alignItems="center"
              mt={5}
              opacity={dateModalShown ? 30 : 100}
            >
              <Text bold color="gray.500">
                Time of meal:
              </Text>
              <Text bold fontSize="lg">
                {mealInfo[index].timestamp.slice(11, 16)}
              </Text>
            </HStack>

            <Box
              w="300px"
              h="300px"
              justifyContent="center"
              alignItems="center"
              zIndex={-1}
              opacity={dateModalShown ? 30 : 100}
            >
              {/* Rotating carousel */}
              <HStack w="300px" h="300px" alignItems="center">
                <Pressable
                  onPress={() => {
                    setIndex(index == 0 ? mealInfo.length - 1 : index - 1);
                  }}
                >
                  <ChevronLeftIcon />
                </Pressable>

                <MealsNavigation
                  routes={routes}
                  index={index}
                  setIndex={setIndex}
                  renderSceneObj={renderSceneObj}
                />

                <Pressable
                  onPress={() => {
                    setIndex(index == mealInfo.length - 1 ? 0 : index + 1);
                  }}
                >
                  <ChevronRightIcon />
                </Pressable>
              </HStack>
            </Box>
            <MealConts
              zIndex={-1}
              contents={mealInfo[index].food}
              mealId={mealInfo[index].mealId}
              refresh={refresh}
            />
          </>
        )}

        {isEmpty && !loading && (
          <Box my={10} zIndex={-1}>
            <Text>No meal data available.</Text>
          </Box>
        )}
        {loading && <Spinner />}
      </Center>
    </Box>
  );
};

export default MealPage;
