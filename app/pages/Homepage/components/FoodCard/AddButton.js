import React, { useState } from "react";
import {
  Popover,
  Button,
  Box,
  Text,
  Icon,
  Input,
  Select,
  CheckIcon,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useStore } from "react-redux";

import { addFood } from "../../../../utils";

function AddButton({ mealId, isLastMeal, refresh }) {
  const [correctFoodGroup, setCorrectFoodGroup] = useState("");
  const [foodName, setFoodName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErr, setShowErr] = useState(false);

  const store = useStore();

  const handleSubmit = async () => {
    setLoading(true);

    let res = await addFood(mealId, foodName, correctFoodGroup);
    if (res.success) {
      if (isLastMeal) {
        store.dispatch({
          type: "update/addFood",
          payload: {
            foodId: res.data.foodId,
            foodGroup: correctFoodGroup,
            foodName,
          },
        });
      } else {
        refresh();
      }

      setShowSuccess(true);
    }

    setFoodName("");
    setCorrectFoodGroup("");

    setLoading(false);
    setTimeout(() => {
      setShowAddModal(false);
      setShowSuccess(false);
    }, 800);
  };

  return (
    <>
      <Popover
        isOpen={showAddModal}
        onClose={setShowAddModal}
        trigger={(triggerProps) => {
          return (
            <Button
              borderRadius={200}
              w="35px"
              h="35px"
              position="absolute"
              bottom="0"
              right="0"
              {...triggerProps}
              onPress={() => {
                setShowAddModal(!showAddModal);
              }}
            >
              <Icon as={Ionicons} name="add-outline" size="sm" />
            </Button>
          );
        }}
      >
        <Popover.Content accessibilityLabel="Delete Customerd" w="56">
          <Popover.Arrow />
          <Popover.CloseButton />
          <Popover.Header>Add food item</Popover.Header>
          <Popover.Body>
            <Text>
              Did we miss something? If you spot a food in the picture that we
              didn't, feel free to add it in here!
            </Text>
            <Input
              onChangeText={(x) => {
                setFoodName(x);
              }}
              placeholder="Food Name"
              value={foodName}
            />

            <Select
              selectedValue={correctFoodGroup}
              onValueChange={(x) => {
                setCorrectFoodGroup(x);
              }}
              accessibilityLabel="Choose food group"
              placeholder="Choose group"
              _selectedItem={{
                bg: "primary.200",
                endIcon: <CheckIcon size={5} />,
              }}
            >
              <Select.Item label="Dairy" value="dairy" />
              <Select.Item label="Dessert" value="dessert" />
              <Select.Item label="Fruit" value="fruit" />
              <Select.Item label="Grain" value="grain" />
              <Select.Item label="Protein" value="protein" />
              <Select.Item label="Vegetables" value="vegetables" />
            </Select>
          </Popover.Body>
          <Popover.Footer justifyContent="flex-end">
            <Button.Group space={2}>
              <Button
                onPress={() => {
                  handleSubmit();
                }}
                colorScheme={showSuccess ? "green" : "primary"}
                isLoading={loading}
              >
                {showSuccess ? "Success!" : "Add"}
              </Button>
            </Button.Group>
          </Popover.Footer>
        </Popover.Content>
      </Popover>
    </>
  );
}

export default AddButton;
