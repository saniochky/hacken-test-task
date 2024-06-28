import type { FC } from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { LinePlot, lineElementClasses } from '@mui/x-charts/LineChart';

const pDataUp = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const pDataDown = [4300, 3800, 4800, 3908, 9800, 1398, 2400];
const xLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

interface ICoinPriceChartProps {
    goingUp: boolean;
}

const CoinPriceChart: FC<ICoinPriceChartProps> = ({ goingUp }) => {
    return (
        <ChartContainer
            width={50}
            height={30}
            margin={{ top: 3, right: 0, bottom: -3, left: 0 }}
            series={[{ type: 'line', data: goingUp ? pDataUp : pDataDown }]}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
            sx={{
                [`& .${lineElementClasses.root}`]: {
                    stroke: goingUp ? 'green' : 'red',
                    strokeWidth: 2,
                },
            }}
            disableAxisListener
        >
            <LinePlot />
        </ChartContainer>
    );
};

export default CoinPriceChart;
