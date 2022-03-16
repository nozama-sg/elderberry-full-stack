import React, { useState, useEffect } from "react";
import { Text, Box, HStack, Image, Stack, Heading, Spinner } from "native-base";
import { connect, useStore } from "react-redux";

import ContentList from "./ContentList";
import { dateToDaysAndTime, getLastmeal } from "../../../../utils";

const FoodCard = ({ data, refresh }) => {
  return (
    <>
      {data && (
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
          <Stack p="4" space={3}>
            <Stack space={2}>
              <Heading size="md">Meal🥗</Heading>

              <HStack space={1}>
                {data.timestamp && (
                  <Text fontSize="md" color="gray.600" bold>
                    {dateToDaysAndTime(
                      new Date(
                        `${data.timestamp.slice(0, 10)}T${data.timestamp.slice(
                          11
                        )}`
                      )
                    )}
                  </Text>
                )}
                {!data.loaded && <Spinner />}
                {data.loaded && !data.mealId && (
                  <Text>No meal data found.</Text>
                )}
              </HStack>

              <HStack width="100%" justifyContent="space-between">
                {data.food ? (
                  <HStack alignItems="center" style={{ position: "relative" }}>
                    <Box shadow={2} w="140" h="140" justifyContent="center">
                      <Image
                        source={{
                          uri: data.imgUrl,
                        }}
                        alt="Alternate Text"
                        w="130"
                        h="130"
                        borderRadius={20}
                      />
                    </Box>
                    <Box w="200px">
                      <Text bold fontSize="lg" ml={3}>
                        Content
                      </Text>
                      <Box h="150px">
                        <ContentList
                          contList={data.food.map((e, i) => ({
                            ...e,
                            key: i,
                          }))}
                          mealId={data.mealId}
                          refresh={refresh}
                        />
                      </Box>
                    </Box>
                  </HStack>
                ) : (
                  <></>
                )}
              </HStack>
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.lastMealData,
  };
};

export default connect(mapStateToProps)(FoodCard);
