import { View, Text, Box, Icon, Heading } from 'native-base'
import React from 'react'
import SvgQRCode from 'react-native-qrcode-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DoctorCode = ({ url, setVisible }) => {
   return (
      <>
         <Box
            position='absolute'
            w='100%'
            h='100%'
            alignItems='center'
            justifyContent='center'
            zIndex={5}>
            <Box
               justifyContent='center'
               alignItems='center'
               h="400px"
               w="400px"
               mx={4}
               bg='white'
               shadow='3'
            >
               <Icon
                  as={Ionicons}
                  name="close-outline"
                  size="sm"
                  position='absolute'
                  right='3'
                  top="2"
                  onPress={() => { setVisible(false) }}
               />
               <Heading textAlign='center'>Scan me for patient info</Heading>

               <Box>
                  <SvgQRCode value={url}
                     enableLinearGradient
                     linearGradient={['rgb(255,0,0)', 'rgb(0,255,255)']} size={300} />
               </Box>
            </Box>

         </Box>
      </>

   )
}

export default DoctorCode