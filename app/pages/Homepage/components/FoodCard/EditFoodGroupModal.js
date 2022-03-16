import React, { useState } from "react";
import {
  Modal,
  Text,
  FormControl,
  Input,
  Button,
  Select,
  CheckIcon,
} from "native-base";
import { useStore } from "react-redux";

import { editFoodGroup } from "../../../../utils";

const EditModal = ({ data, itemId, setShowEditModal }) => {
  const store = useStore();
  const foodObj = data.filter((x) => x.key == itemId)[0];

  const [foodGroup, setFoodGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    let res = await editFoodGroup(foodObj.foodId, foodGroup);
    setLoading(true);
    console.log(res);
    if (res.success && res.data.status == 200) {
      store.dispatch({
        type: "update/foodGroup",
        payload: {
          foodGroup,
          key: foodObj.foodId,
        },
      });

      setLoading(false);
      setSuccess(true);
    }

    setTimeout(() => {
      setShowEditModal(false);
    }, 500);
  };

  return (
    <Modal isOpen={setShowEditModal} onClose={() => setShowEditModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>
          <Text color="gray.500">Edit food group label for:</Text>
          <Text bold>{foodObj.foodName}</Text>
        </Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Food Group</FormControl.Label>
            <Select
              selectedValue={foodGroup}
              onValueChange={(x) => {
                setFoodGroup(x);
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
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setShowEditModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme={success ? "green" : "primary"}
              onPress={() => {
                handleSubmit();
              }}
              isLoading={loading}
            >
              {success ? "Success" : "Save"}
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default EditModal;
