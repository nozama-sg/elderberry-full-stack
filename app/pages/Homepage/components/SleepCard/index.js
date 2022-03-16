import React, { useState, useEffect } from "react";
import {
  Center,
  Text,
  Box,
  HStack,
  Stack,
  Heading,
  Badge,
  VStack,
} from "native-base";
import { VictoryPie, VictoryTheme } from "victory-native";
import { connect } from "react-redux";

const SleepTime = ({ data }) => {
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
      <Stack p="4" height="100%" justifyContent="center">
        <Stack space={2}>
          <Heading size="md">Sleep Data💤</Heading>
        </Stack>

        <Center h={90} w="100%">
          <VStack>
            {data.length > 0 && (
              <>
                <HStack alignItems="center" space={1}>
                  <Text bold fontSize="2xl">
                    {Math.trunc(data[0]["y"] / 3600)}
                  </Text>
                  <Text fontSize="lg">hr</Text>
                  <Text bold fontSize="2xl">
                    {Math.trunc(
                      (data[0]["y"] - Math.trunc(data[0]["y"] / 3600) * 3600) /
                        60
                    )}
                  </Text>
                  <Text fontSize="lg">min</Text>
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  In bed
                </Text>
              </>
            )}
          </VStack>
        </Center>
      </Stack>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.sleepData.D,
  };
};

export default connect(mapStateToProps)(SleepTime);
