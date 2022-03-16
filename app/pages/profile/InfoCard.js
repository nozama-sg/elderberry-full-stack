import React from 'react';
import { Box, HStack, Text } from 'native-base'

const InfoCard = ({ label, data, unit }) => {
   return (
      <Box
         shadow={2}
         bg="white"
         h="60px"
         justifyContent='center'
         alignItems='center'>
         <HStack w="100%" px={5} justifyContent='space-between'>
            <Text
               color='gray.400'
               fontSize='md'>{label}</Text>

            <HStack justifyContent='center' alignItems='center' space={1}>
               <Text
                  fontSize='md'>{data}</Text>

               {
                  (unit) &&
                  <Text color='gray.500'>{unit}</Text>
               }
            </HStack>
         </HStack>
      </Box >
   )
}

export default InfoCard
