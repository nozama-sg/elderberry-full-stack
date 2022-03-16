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
  Spinner,
} from "native-base";
import { useStore, connect } from "react-redux";

import ChartComponent from "./Chart";
import { dateToDaysAndTime, getData } from "../../../utils";

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

let HeartRatePage = ({ userId, data }) => {
  const store = useStore();

  const pageMap = ["D", "W", "M", "Y"];
  const [page, setPage] = useState(0);
  const [tickValTmp, setTickValues] = useState();
  const [averageBpm, setAverageBpm] = useState(-1);
  const [theme, setTheme] = useState({});

  const [lastUpdate, setLastUpdate] = useState("");
  const [lastUpdateVal, setLastUpdateVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [isErr, setIsErr] = useState(false);

  useEffect(async () => {
    let arr = ["W", "M", "Y"];
    let heartRateData;

    const d = new Date();
    setLastUpdate(`Today, ${data["D"].slice(d.getHours())[0].x}:00`);
    setLastUpdateVal(data["D"].slice(d.getHours())[0].y);

    for (let i = 0; i < arr.length; i++) {
      if (data[arr[i]].length == 0) {
        heartRateData = await getData(
          "heartRate",
          arr[i],
          store.getState().userInfo.elderlyId
        );
        if (heartRateData.success) {
          store.dispatch({
            type: `update/heartData/${arr[i]}`,
            payload: { data: heartRateData.data },
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    const tickValMap = {
      D: [0, 6, 12, 18, 23],
      W: [0, 3, 6],
      M: [1, 15, 30],
      Y: [1, 6, 12],
    };
    setTickValues(tickValMap[pageMap[page]]);

    let total = 0;
    let toDiv = 0;
    data[pageMap[page]].map(({ x, y }) => {
      if (y > 0) {
        total += y;
        toDiv += 1;
      }
    });

    setAverageBpm(Math.round(total / toDiv));
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

        {/* {(chartData) ? <Text>chart</Text> : <Text>No chart</Text>} */}
        {data[pageMap[page]].length > 0 ? (
          <>
            <VStack pl={3}>
              <Text bold pt={3} color="gray.400">
                AVERAGE
              </Text>
              <HStack alignItems="center">
                <Heading>{averageBpm}</Heading>
                <Text bold pl={1} color="gray.400">
                  bpm
                </Text>
              </HStack>
            </VStack>

            <ChartComponent
              chartData={data[pageMap[page]]}
              tickValues={tickValTmp}
              theme={theme}
            />

            <Box m={5} p={4} bg="gray.200" borderRadius={10}>
              <HStack justifyContent="space-between">
                <Text>{lastUpdate}</Text>
                <HStack justifyContent="center">
                  <Text bold>{lastUpdateVal}</Text>
                  <Text px={0.5} color="gray.500">
                    bpm
                  </Text>
                </HStack>
              </HStack>
            </Box>
          </>
        ) : (
          <></>
        )}

        {loading && <Spinner />}
        {isErr && <Text>An error occured. Try again later.</Text>}
      </VStack>
    </Center>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userInfo.elderlyId,
    data: state.heartData,
  };
};

export default connect(mapStateToProps)(HeartRatePage);
