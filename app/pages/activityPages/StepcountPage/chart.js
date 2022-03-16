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
            domainPadding={20}
        >
            <VictoryAxis crossAxis
                axisLabelComponent={<VictoryLabel dy={20} />}
                tickValues={tickValues}
                tickFormat={(t) => categories[t]}
            />
            <VictoryAxis dependentAxis
                domain={[0, 10000]}
            />
            <VictoryBar
                style={{ data: { fill: "#c43a31" } }}
                data={chartData}
                alignment='start'
            />
        </VictoryChart>
    )
}

export default ChartComponent