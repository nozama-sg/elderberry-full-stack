import React, { useState, useEffect } from "react";
import {
  Badge,
  Center,
  Text,
  Box,
  HStack,
  Stack,
  Heading,
  Spinner,
} from "native-base";
import { VictoryBar } from "victory-native";
import { connect, useStore } from "react-redux";

const StepsCard = ({ data }) => {
  const [stepGoal, setStepGoal] = useState(0);
  const [badgeColor, setBadgeColor] = useState("");

  useEffect(() => {
    setStepGoal(10000);
  }, []);

  return (
    <Box
      width="100%"
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1"
      _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700",
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: "gray.50",
      }}
    >
      <Stack p="4" space={3} height="100%" justifyContent="center">
        <Heading size="md">Step count👣</Heading>

        {data.length > 0 && (
          <>
            <Stack space={2}>
              <HStack alignItems="center" space={1}>
                <Text bold fontSize="lg">
                  {data[data.length - 1]["y"]}
                </Text>
                <Text>steps</Text>
              </HStack>
            </Stack>

            <HStack
              my={2}
              alignItems="center"
              space={4}
              justifyContent="space-between"
            >
              <Center flex={1}>
                <Text
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -10,
                  }}
                  fontSize="xs"
                  color="gray.500"
                >
                  /{stepGoal}
                </Text>

                <VictoryBar
                  width={150}
                  height={30}
                  barWidth={30}
                  barRatio={0}
                  alignment="end"
                  padding={{
                    top: 0,
                  }}
                  data={[{ x: 1, y: data[data.length - 1]["y"] }]}
                  style={{
                    data: {
                      fill: badgeColor,
                    },
                    parent: {
                      backgroundColor: "lightgray",
                    },
                  }}
                  domain={{ x: [0, 1], y: [0, stepGoal] }}
                  animate={{
                    onEnter: {
                      duration: 50,
                      easing: "exp",
                    },
                  }}
                  horizontal
                />
              </Center>
            </HStack>
          </>
        )}

        {/* {loading && <Spinner />} */}
        {/* {err && <Text>An error occured. Try again later.</Text>} */}
      </Stack>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.stepData.D,
  };
};

export default connect(mapStateToProps)(StepsCard);
