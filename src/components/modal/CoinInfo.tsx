import type { FC } from 'react';
import type { ICoinItem, ICoinPrice } from '../../interfaces/interfaces.ts';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { Card, Col, Flex, Row, Skeleton, Typography } from 'antd';
import { LineChart } from '@mui/x-charts/LineChart';
import { E_CURRENCY } from '../../enums/enums.ts';

const { Title, Text } = Typography;

const getLastNHours = (n: number): Date[] => {
    const arr = new Array(n).fill(0);
    const now = new Date(new Date().setMinutes(0));
    return arr.map((_, i) => new Date(now.getTime() - 1000*60*60*(n - i)));
};

interface ICoinInfoProps {
    coinData: ICoinItem;
    currency: E_CURRENCY;
}

const CoinInfo: FC<ICoinInfoProps> = ({ coinData, currency }) => {
    const [priceData, setPriceData] = useState<ICoinPrice>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const getData = useCallback(async (id: string, currency: E_CURRENCY): Promise<ICoinPrice> => {
        const priceData = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart/?vs_currency=${currency}&days=2`);
        return priceData.data;
    }, []);

    useEffect(() => {
        setLoading(true);
        getData(coinData.id, currency)
            .then((data) => setPriceData(data))
            .catch(() => {
                console.log('Error getting data.')
                setPriceData(null);
            })
            .finally(() => setLoading(false));
    }, [getData, coinData, currency]);

    return (
        <Flex vertical gap='middle'>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title='Total Supply' bordered={false}>
                        <Text type='success'>{coinData.total_supply}</Text>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title='Total Volume' bordered={false}>
                        <Text type='success'>{coinData.total_volume}</Text>
                    </Card>
                </Col>
            </Row>
            <Title level={5}>Price History ({currency.toUpperCase()})</Title>
            {loading || !priceData ? <Skeleton /> : (
              <LineChart
                xAxis={[
                    {
                        id: 'x',
                        data: getLastNHours(priceData.prices.length),
                        scaleType: 'time',
                        valueFormatter: (date) =>
                          date.toLocaleString('default', {
                              minute: 'numeric',
                              hour: '2-digit',
                              weekday: 'short',
                          }),
                    },
                ]}
                series={[
                    {
                        data: priceData.prices.map((el) => el[1]),
                    },
                ]}
                width={500}
                height={300}
                margin={{ top: 10, bottom: 40, right: 25 }}
              />
            )}
        </Flex>
    );
};

export default CoinInfo;
