import type { FC } from 'react';
import type { ICoinItem, ICoinPrice } from '../../interfaces/interfaces.ts';
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { Flex } from 'antd';
import CoinPriceChart from '../chart/CoinPriceChart.tsx';
import { E_CURRENCY } from '../../enums/enums.ts';

interface ICoinInfoProps {
    coinData: ICoinItem;
    currency: E_CURRENCY;
}

const CoinInfo: FC<ICoinInfoProps> = ({ coinData, currency }) => {
    const [priceData, setPriceData] = useState<[number, number][]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getData = useCallback(async (id: string, currency: E_CURRENCY): Promise<ICoinPrice> => {
        const priceData = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/?vs_currency=${currency}&days=2`);
        return priceData.data;
    }, []);

    useEffect(() => {
        setLoading(true);
        getData(coinData.id, currency)
            .then((data) => setPriceData(data.prices))
            .catch(() => {
                console.log('Error occured.')
                setPriceData([]);
            })
            .finally(() => setLoading(false));
    }, [getData, coinData, currency]);

    return (
        <Flex>
            <CoinPriceChart goingUp />
        </Flex>
    );
};

export default CoinInfo;
