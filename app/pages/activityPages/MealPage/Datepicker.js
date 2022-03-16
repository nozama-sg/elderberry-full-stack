import React, { useState } from "react";
import { Platform } from "react-native";
import { Box, Button, Center } from "native-base";
import RNDateTimePicker from "@react-native-community/datetimepicker";

import { dateToDay } from "../../../utils";

export const DatePicker = ({ show, setShow, date, setDate }) => {
  const onChange = (event, selectedDate) => {
    const currentDate =
      new Date(selectedDate.getTime() + 10 * 1000 * 3600) || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  return (
    <Box mt={4} w="100%">
      <Center zIndex={5}>
        <Button bg="gray.200" w="150px" onPress={() => setShow(!show)}>
          {dateToDay(date)}
        </Button>
      </Center>
      <Box w="100%" position="absolute" zIndex={2}>
        {show && (
          <RNDateTimePicker
            mode="date"
            value={date}
            display="spinner"
            maximumDate={new Date()}
            onChange={(e, s) => onChange(e, s)}
            style={{
              backgroundColor: "white",
            }}
          />
        )}
      </Box>
    </Box>
  );
};
