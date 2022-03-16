import React from "react";
import { Popover, Text, Pressable, Badge } from "native-base";
import * as Linking from "expo-linking";

const AnomalyPopover = ({ anomalyData, anomalyType, infoUrl }) => {
  return (
    <Popover
      trigger={(triggerProps) => {
        return (
          <Pressable {...triggerProps}>
            {anomalyData && (
              <Text color="amber.600" underline>
                {anomalyData.length}{" "}
                {anomalyData.length > 1 ? "anomalies" : "anomaly"}
              </Text>
            )}
          </Pressable>
        );
      }}
    >
      <Popover.Content accessibilityLabel="Delete Customerd" w="56">
        <Popover.Arrow />
        <Popover.CloseButton />
        <Popover.Header>{anomalyType}Anomaly</Popover.Header>
        <Popover.Body>
          {anomalyData
            .filter((x) => Math.abs((x.delta / x.val).toFixed(2)) > 0)
            .map(({ date, type, val, delta }) => {
              let pDelta = Math.abs((delta / val).toFixed(2));
              let textColor = pDelta > 0.3 ? "red.500" : "yellow.600";
              let badgeColor = pDelta > 0.3 ? "red.200" : "orange.200";
              let badgeText = pDelta > 0.3 ? "Severe" : "Warn";

              return (
                <>
                  <>
                    <Text underline fontSize="md" bold>
                      {`${date.slice(0, 10)} ${date.slice(11)}`}
                    </Text>
                    <Badge w="60px" h="20px" bg={badgeColor}>
                      {badgeText}
                    </Badge>
                    <Text color="gray.500">
                      {anomalyType} was <Text bold>{val}</Text>, which is{" "}
                      <Text bold color={textColor}>
                        {pDelta}x {type}
                      </Text>{" "}
                      than normal.
                    </Text>
                  </>
                </>
              );
            })}
        </Popover.Body>
        <Popover.Footer justifyContent="flex-start">
          <Text
            color="blue.500"
            onPress={() => {
              Linking.openURL(infoUrl);
            }}
          >
            Find out more
          </Text>
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  );
};

export default AnomalyPopover;
