import React, { useState } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import {
  Box,
  Text,
  Pressable,
  Icon,
  HStack,
  VStack,
  ScrollView,
} from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { useStore } from "react-redux";

import AddButton from "./AddButton";
import EditModal from "./EditFoodGroupModal";
import { deleteFood, editFoodGroup } from "../../../../utils";

function ContentList({ contList, mealId, refresh }) {
  const store = useStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  const deleteRow = async (foodId) => {
    const resp = await deleteFood(foodId);
    console.log(resp, "food del");

    console.log(foodId);

    refresh();
  };

  const onRowOpen = (key) => {
    setOpenIndex(key);
  };

  const renderItem = ({ item, index }) => {
    return (
      <Box>
        <Pressable
          _dark={{
            bg: "coolGray.800",
          }}
          _light={{
            bg: "white",
          }}
          style={{
            borderWidth: 1,
            borderColor: "lightgray",
            borderStyle: "solid",
          }}
        >
          <Box pl="4" pr="5" py="2">
            <HStack alignItems="center" space={3}>
              <VStack>
                <Text
                  color="coolGray.800"
                  _dark={{
                    color: "warmGray.50",
                  }}
                  bold
                >
                  {item.foodName}
                </Text>
                <Text
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  {item.foodGroup}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </Pressable>
      </Box>
    );
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <HStack flex="1" pl="2">
        {showEditModal && contList && (
          <EditModal
            setShowEditModal={setShowEditModal}
            itemId={openIndex}
            data={contList}
          />
        )}
        <Pressable
          w="70"
          ml="auto"
          bg="coolGray.200"
          justifyContent="center"
          onPress={() => {
            rowMap[openIndex].closeRow();
            setShowEditModal(true);
          }}
          _pressed={{
            opacity: 0.5,
          }}
        >
          <VStack alignItems="center" space={2}>
            <Icon
              as={<Entypo name="dots-three-horizontal" />}
              size="xs"
              color="coolGray.800"
            />
            <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
              Edit
            </Text>
          </VStack>
        </Pressable>
        <Pressable
          w="70"
          bg="red.500"
          justifyContent="center"
          onPress={() => deleteRow(data.item.foodId)}
          _pressed={{
            opacity: 0.5,
          }}
        >
          <VStack alignItems="center" space={2}>
            <Icon
              as={<MaterialIcons name="delete" />}
              color="white"
              size="xs"
            />
            <Text color="white" fontSize="xs" fontWeight="medium">
              Delete
            </Text>
          </VStack>
        </Pressable>
      </HStack>
    );
  };

  return (
    <Box h="100%">
      <ScrollView h="100%" borderWidth={0.5} borderColor="gray.200">
        <SwipeListView
          data={contList}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-130}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onRowDidOpen={onRowOpen}
          stopLeftSwipe={1}
        />
      </ScrollView>
      <Box mt={10}>
        <AddButton mealId={mealId} refresh={refresh} />
      </Box>
    </Box>
  );
}

export default ContentList;
