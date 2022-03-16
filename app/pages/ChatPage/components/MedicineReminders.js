import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Center,
  Heading,
  HStack,
  VStack,
  CheckIcon,
  ScrollView,
  Button,
  CloseIcon,
  Input,
  Select,
  CheckCircleIcon,
  Icon,
} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useStore } from "react-redux";

import { announceReminder, getAllMedReminders } from "../../../utils";

let prod = false;

const SingleReminder = ({ medicine, time, checked, id, deleteReminder }) => {
  return (
    <Box w="100%" bg="gray.50" shadow={1} mb={2}>
      <HStack p={2}>
        <CheckCircleIcon
          color={checked ? "green.400" : "gray.300"}
          alignSelf="center"
          size="20px"
          mr={2}
          position="absolute"
          left="2"
        />
        <VStack pl="30px">
          <Text fontSize="md">{medicine}</Text>
          <Text color="gray.500">{time}</Text>
        </VStack>

        <Icon
          as={Ionicons}
          name="trash"
          size="sm"
          color="red.400"
          position="absolute"
          right="3"
          top="4"
          onPress={() => {
            deleteReminder(id);
          }}
        />
      </HStack>
    </Box>
  );
};

const CurrReminders = ({ setMedicineReminderVisible }) => {
  const [reminders, setReminders] = useState({
    Morning: [],
    Afternoon: [],
    Evening: [],
  });

  const [numDoses, setNumDoses] = useState(0);
  const [chosenTime, setChosenTime] = useState({
    0: new Date(),
    1: new Date(),
    2: new Date(),
  });
  const [medicineToAdd, setMedicineToAdd] = useState("");

  const store = useStore();

  const getMedFromServer = async () => {
    let r = await getAllMedReminders(store.getState().userInfo.elderlyId);
    let mArr = r.data.data;
    console.log(mArr);
    mArr.map(({ medId, medicine, time }) => {
      time.map((t) => {
        let timeCat = "";
        if (parseInt(t.split(":")[0]) < 11) {
          timeCat = "Morning";
        } else if (parseInt(t.split(":")[0]) < 17) {
          timeCat = "Afternoon";
        } else {
          timeCat = "Evening";
        }

        console.log(timeCat, t);
        setReminders(
          Object.assign({}, reminders, {
            [timeCat]: [
              ...reminders[timeCat],
              {
                medicine,
                time: t,
                checked: false,
                id: medId,
              },
            ],
          })
        );
      });
    });
  };

  useEffect(async () => {
    setReminders({
      Morning: [
        { medicine: "Antibiotics", time: "8:00", checked: true, id: 1 },
        { medicine: "Vitamin C", time: "8:10", checked: true, id: 2 },
        {
          medicine: "High blood pressure medicine",
          time: "8:20",
          checked: false,
          id: 3,
        },
      ],
      Afternoon: [
        {
          medicine: "High blood pressure medicine",
          time: "13:00",
          checked: false,
          id: 4,
        },
        { medicine: "Diabetes medicine", time: "13:10", checked: false, id: 5 },
      ],
      Evening: [
        { medicine: "Antibiotics", time: "19:00", checked: false, id: 6 },
      ],
    });
  }, []);

  const handleNewReminder = async () => {
    for (let i = 0; i < numDoses; i++) {
      let t = chosenTime[i];
      let timeCat = "";
      if (t.getHours() < 11) {
        timeCat = "Morning";
      } else if (t.getHours() < 17) {
        timeCat = "Afternoon";
      } else {
        timeCat = "Evening";
      }

      if (prod) {
        let r = await announceReminder(
          store.getState().userInfo.elderlyId,
          medicineToAdd,
          Object.values(chosenTime)
            .slice(0, numDoses)
            .map((e) => e.toString().slice(16, 21))
        );

        if (r.data != "Already exists") {
          console.log(r, "new data");
          setReminders({
            ...reminders,
            [timeCat]: [
              ...reminders[timeCat],
              {
                medicine: medicineToAdd,
                time: `${t.getHours()}:${
                  t.getMinutes().toString().length == 1
                    ? "0" + t.getMinutes().toString()
                    : t.getMinutes().toString()
                }`,
                checked: false,
                id: r.data,
              },
            ],
          });
        } else {
          console.log("This reminder already exists");
        }
      } else {
        setTimeout(() => {
          setReminders({
            ...reminders,
            [timeCat]: [
              ...reminders[timeCat],
              {
                medicine: medicineToAdd,
                time: `${t.getHours()}:${
                  t.getMinutes().toString().length == 1
                    ? "0" + t.getMinutes().toString()
                    : t.getMinutes().toString()
                }`,
                checked: false,
                id: 9,
              },
            ],
          });
        }, 200);
      }
    }
  };

  const deleteReminder = (id) => {
    console.log("id", id);

    Object.keys(reminders).map((k) => {
      if (reminders[k].filter((x) => x.id == id).length > 0) {
        setReminders({
          ...reminders,
          [k]: reminders[k].filter((x) => x.id != id),
        });
      }
    });
  };

  return (
    <Box h="100%" justifyContent="center" alignItems="center">
      <Box
        alignItems="center"
        width="360px"
        height="650px"
        bg="white"
        shadow={2}
        position="absolute"
        top="10px"
        p={5}
      >
        <CloseIcon
          size="xs"
          position="absolute"
          right="4"
          top="4"
          onPress={() => {
            setMedicineReminderVisible(false);
          }}
        />
        <Text bold fontSize="xl">
          Current Reminders🔔
        </Text>
        <Box
          h="250px"
          w="100%"
          justifyContent="center"
          mt={3}
          borderWidth="0.5"
          borderColor="gray.200"
        >
          <ScrollView>
            {reminders &&
              Object.keys(reminders).map((e) => {
                return (
                  <>
                    <Text bold fontSize="lg" color="primary.700">
                      {e}
                    </Text>

                    <Box>
                      {reminders[e].map(({ medicine, time, checked, id }) => {
                        return (
                          <SingleReminder
                            medicine={medicine}
                            time={time}
                            checked={checked}
                            id={id}
                            deleteReminder={deleteReminder}
                          />
                        );
                      })}
                    </Box>
                  </>
                );
              })}
          </ScrollView>
        </Box>

        <Box w="100%" mt={3}>
          <Text bold fontSize="xl" textAlign="center" mb={3}>
            Add Reminder➕
          </Text>

          <Box h="200px" borderWidth="0.5" borderColor="gray.200">
            <ScrollView m={3}>
              <Input
                placeholder="Medicine name"
                w="100%"
                my={2}
                value={medicineToAdd}
                onChangeText={setMedicineToAdd}
              />

              <Select
                selectedValue={numDoses}
                onValueChange={(x) => {
                  setNumDoses(x);
                }}
                mb={2}
                placeholder="Number of doses"
              >
                <Select.Item label="1" value={1} />
                <Select.Item label="2" value={2} />
                <Select.Item label="3" value={3} />
              </Select>

              {[...Array(numDoses)].map((e, i) => {
                return (
                  <HStack space={3} alignItems="center" mb={1}>
                    <Text>Dose {i + 1}</Text>
                    <DateTimePicker
                      key={i}
                      value={chosenTime[i]}
                      onChange={(_, date) => {
                        setChosenTime({ ...chosenTime, [i]: date });
                      }}
                      mode="time"
                      style={{ width: "100%" }}
                    />
                  </HStack>
                );
              })}
            </ScrollView>
          </Box>
        </Box>
        <Button
          w="100%"
          mt={5}
          onPress={() => {
            handleNewReminder();
          }}
        >
          Add Reminder
        </Button>
      </Box>
    </Box>
  );
};

function MedicineReminders({ setMedicineReminderVisible }) {
  return (
    <CurrReminders setMedicineReminderVisible={setMedicineReminderVisible} />
  );
}

export default MedicineReminders;
