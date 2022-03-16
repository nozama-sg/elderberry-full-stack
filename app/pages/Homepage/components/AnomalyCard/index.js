import React, { useState, useEffect } from "react";
import { Text, Box, Stack, Heading, Skeleton, HStack } from "native-base";
import { connect } from "react-redux";

import AnomalyPopover from "./AnomalyPopover";

const AnomalyBlock = ({ anomalyData, type, infoUrl }) => {
  return (
    <>
      <HStack mt={2} alignItems="center">
        <Text w="150px" fontSize="md">
          {type}
        </Text>
        {anomalyData && (
          <AnomalyPopover
            anomalyData={anomalyData}
            anomalyType={type}
            infoUrl={infoUrl}
          />
        )}
      </HStack>
    </>
  );
};

const AnomalyCard = ({ data }) => {
  return (
    <Box alignItems="center" width="100%">
      <Box
        width="100%"
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        py={4}
        px={3}
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
        <Stack>
          <Heading size="md">Anomalies⚠️</Heading>

          <Skeleton.Text
            lines={4}
            my={3}
            isLoaded={data.loaded}
            startColor="amber.100"
            endColor="gray.200"
          >
            <Box h="130px" justifyContent="center">
              <AnomalyBlock
                anomalyData={data.stepAsymmetry}
                type="Step Asymmetry"
                infoUrl="https://www.healthline.com/health/unsteady-gait"
              />
              <AnomalyBlock
                anomalyData={data.heartRate}
                type="Heart Rate"
                infoUrl="https://www.healthline.com/health/abnormal-heart-rhythms"
              />
              <AnomalyBlock
                anomalyData={data.stepCount}
                type="Step Count"
                infoUrl="https://www.healthline.com/health/fatigue"
              />
              <AnomalyBlock
                anomalyData={data.sleepSeconds}
                type="Sleep"
                infoUrl="https://www.healthline.com/health/fatigue"
              />
            </Box>
          </Skeleton.Text>

          {/* Checks that there are no anomalies */}
          {data.loaded &&
            !data.heartRate &&
            !data.stepAsymmetry &&
            !data.stepCount &&
            !data.sleepSeconds && (
              <Box mt={3}>
                <Text>No anomalies found.</Text>
              </Box>
            )}
        </Stack>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    data: state.anomalies,
  };
};

export default connect(mapStateToProps)(AnomalyCard);
