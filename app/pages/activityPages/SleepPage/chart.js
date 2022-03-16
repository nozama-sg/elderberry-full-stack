import { Chart, Line, Area, HorizontalAxis, VerticalAxis, Tooltip } from 'react-native-responsive-linechart'
import { VictoryChart, VictoryBar, VictoryTheme, VictoryLabel, VictoryAxis, LineSegment } from 'victory-native'

const ChartComponent = ({ chartData, categories, tickValues }) => {
    let xMax = -1
    chartData.map(({ x }) => {
        if (x > xMax) {
            xMax = x
        }
    })

    return (
        <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={10}
        >
            <VictoryAxis crossAxis
                axisLabelComponent={<VictoryLabel dy={20} />}
                tickValues={tickValues}
                tickFormat={(t) => categories[t]}

            />
            <VictoryAxis dependentAxis
                domain={[0, 10000]}
                tickFormat={(t) => {
                    let hours = Math.trunc(t / (60 * 60))
                    return `${hours}hr`
                }}
            />
            <VictoryBar
                style={{ data: { fill: "#4337b0" }}}
                data={chartData}
                alignment='middle'
            />
        </VictoryChart>
    )
}

export default ChartComponent