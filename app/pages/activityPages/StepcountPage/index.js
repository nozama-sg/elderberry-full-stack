import React, { useState, useEffect } from "react";
import { Animated } from "react-native";
import {
  Heading,
  Text,
  Pressable,
  Box,
  Center,
  HStack,
  VStack,
} from "native-base";

import ChartComponent from "./chart";
import {
  dateToDaysAndTime,
  getData,
  dateToTime,
  getTickVal,
  getCategories,
} from "../../../utils";
import { connect, useStore } from "react-redux";

const TabBar = ({ nav, position, setPos }) => {
  return (
    <Box flexDirection="row" bg="gray.200" h="30px" borderRadius={5}>
      {nav.map((name, i) => {
        return (
          <Box
            flex={1}
            bg={position === i ? "white" : "gray.200"}
            borderRadius={5}
          >
            <Box
              flex={1}
              alignItems="center"
              justifyContent="center"
              my={2}
              borderRightWidth="0.5px"
              borderRightColor="gray.400"
              id={i}
              key={`key-${i}`}
            >
              <Pressable
                w="100%"
                h="100%"
                flex={1}
                alignItems="center"
                justifyContent="center"
                onPress={() => {
                  setPos(i);
                }}
              >
                <Text fontSize="2xs">{name}</Text>
              </Pressable>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

const navObjs = ["D", "W", "M", "Y"];

let StepcountPage = ({ data }) => {
  const pageMap = ["D", "W", "M", "Y"];
  const store = useStore();

  const [page, setPage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [aveSteps, setAveSteps] = useState(-1);
  const [tickValues, setTickValues] = useState([]);

  const [lastUpdate, setLastUpdate] = useState("");
  const [lastUpdateVal, setLastUpdateVal] = useState("");

  useEffect(async () => {
    let arr = ["W", "M", "Y"];
    let stepCountData;
    let h = new Date().getHours();
    setLastUpdateVal(data["D"].slice(h)[0].y);
    setLastUpdate(`Today, ${data["D"].slice(h)[0].x}:00`);

    for (let i = 0; i < arr.length; i++) {
      if (data[arr[i]].length == 0) {
        stepCountData = await getData(
          "stepCount",
          arr[i],
          store.getState().userInfo.elderlyId
        );
        if (stepCountData.success) {
          store.dispatch({
            type: `update/stepData/${arr[i]}`,
            payload: { data: stepCountData.data },
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setCategories(getCategories(pageMap[page]));
    setTickValues(getTickVal(pageMap[page]));

    if (data && page == 0) {
      setAveSteps(data[pageMap[page]].slice(-1)[0].y);
    } else if (data) {
      let t = 0,
        d = 0;

      data[pageMap[page]].map(({ x, y }) => {
        if (y > 0) {
          t += y;
          d += 1;
        }
      });
      setAveSteps(Math.round(t / d));
    }
  }, [page]);

  return (
    <Center>
      <VStack mx={5} my={5}>
        <Box mx={3}>
          <TabBar
            nav={navObjs}
            position={page}
            setPos={(x) => {
              setPage(x);
            }}
          />
        </Box>

        <VStack pl={3}>
          {page === 0 ? (
            <Text bold pt={3} color="gray.400">
              TOTAL
            </Text>
          ) : (
            <Text bold pt={3} color="gray.400">
              AVERAGE
            </Text>
          )}
          <HStack alignItems="center">
            <Heading>{aveSteps}</Heading>
            <Text bold pl={1} color="gray.400">
              steps
            </Text>
          </HStack>
        </VStack>

        {data && (
          <ChartComponent
            chartData={data[pageMap[page]]}
            categories={categories}
            tickValues={tickValues}
          />
        )}

        <Box m={5} p={4} bg="gray.200" borderRadius={10}>
          <HStack justifyContent="space-between">
            <Text>{lastUpdate}</Text>
            <Text>
              <Text bold>{lastUpdateVal} </Text>
              steps
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Center>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.stepData,
  };
};

export default connect(mapStateToProps)(StepcountPage);
