import React, { useState, useEffect } from 'react';
import { Text, Box, Center, HStack, Spinner, Image, Stack, Heading, Badge } from 'native-base'
import { Chart, Line, Area, HorizontalAxis, VerticalAxis, Tooltip } from 'react-native-responsive-linechart'
import { useStore, connect } from 'react-redux';

// import { getData } from '../../../utils';

const HeartCard = ({ data }) => {
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState()

    const [badgeColour, setBadgeColour] = useState('info')

    const getCurrentHeartRate = (allData) => {
        let currHeartRate = 0
        allData.map(({ x, y }) => {
            if(x == new Date().getHours()) {
                currHeartRate = y
            }
        })

        return currHeartRate
    }

    return <Box alignItems="center" width='100%'>
        <Box width="100%" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1" _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700"
        }} _web={{
            shadow: 2,
            borderWidth: 0
        }} _light={{
            backgroundColor: "gray.50"
        }}>
            <Stack p="4" space={3}>
                <Stack space={2}>
                    <Heading size="md">
                        Heart Rate❤️
                    </Heading>

                    {(data.length > 0) &&
                        <HStack alignItems="center" space={1} mt={-1}>
                            <Text
                                fontSize='lg'
                                bold>
                                {getCurrentHeartRate(data)}
                            </Text>
                            <Text>
                                bpm
                            </Text>
                        </HStack>
                    }

                </Stack>
            </Stack>
            <Box mt={-4}>
                {(data.length > 0) &&
                    <Chart
                        style={{ height: 120, width: '100%' }}
                        data={data}
                        padding={{ left: 40, bottom: 20, right: 20, top: 20 }}
                        xDomain={{ min: 1, max: 24 }}
                        yDomain={{ min: 0, max: 150 }}
                    >
                        <VerticalAxis tickCount={3} />
                        <HorizontalAxis
                            tickValues={[0, 6, 12, 18, 24]}
                            theme={{
                                labels: { formatter: (h) => `${h.toFixed(0)}:00` },
                            }}
                        />
                        <Area
                            theme={{ gradient: { from: { color: '#ffa502' }, to: { color: '#ffa502', opacity: 0.4 } } }} />
                        <Line
                            theme={{ stroke: { color: '#ffa502', width: 2 }, }}
                        />
                    </Chart>
                }

                {
                    loading && <Spinner />
                }

                {err && <Text mx={4}>An error occured. Try again later.</Text>}

            </Box>
        </Box>
    </Box >;
};

const mapStateToProps = (state) => {
    return {
        data: state.heartData.D
    }
}

export default connect(mapStateToProps)(HeartCard)