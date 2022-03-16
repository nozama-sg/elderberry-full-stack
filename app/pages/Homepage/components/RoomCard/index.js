import React, { useState, useEffect } from "react";
import { Text, Box, Stack, VStack, HStack, Heading, Center } from "native-base";
import { connect } from "react-redux";

const minToHourMin = (m) => {
  return `${Math.trunc(m / 60)}h ${m - Math.trunc(m / 60) * 60}min`;
};

function RoomCard({ currRoomData }) {
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
      <Stack p="4" justifyContent="center">
        <Stack space={2}>
          <Heading size="md"> Location📍 </Heading>
        </Stack>
        <Center h={50} w="100%">
          <VStack>
            {currRoomData && (
              <>
                <HStack alignItems="center" space={1}>
                  <Text fontSize="lg"> Currently In: </Text>
                  <Text bold fontSize="xl">
                    {currRoomData.room}
                  </Text>
                </HStack>
                <Text fontSize="xs" color="gray.500" ml={1}>
                  For: {minToHourMin(currRoomData.timeSpent)}
                </Text>
              </>
            )}
          </VStack>
        </Center>
      </Stack>
    </Box>
  );
}

const mapStateToProps = (state) => {
  return {
    currRoomData: state.locationData.current,
  };
};

export default connect(mapStateToProps)(RoomCard);
