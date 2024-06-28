import type { FC } from 'react'
import type { TablePaginationConfig, TableProps } from 'antd';
import type { ICoinItem } from './interfaces/interfaces.ts';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Flex, Image, Select, Table, Typography } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import CoinPriceChartTiny from './components/chart/CoinPriceChartTiny.tsx';
import { E_CURRENCY, E_ORDER } from './enums/enums.ts';
import { APP_CODE } from './constants/codeMirror.ts';

const { Title } = Typography;

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const COIN_TABLE_COLUMNS = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, { image }: ICoinItem) => (
            <Flex gap='small' align='center'>
                <Image src={image} width={32} />
                {text}
            </Flex>
        ),
    },
    {
        title: 'Current Price',
        dataIndex: 'current_price',
        key: 'current_price',
    },
    {
        title: '24H Price Change, %',
        dataIndex: 'price_change_percentage_24h',
        key: 'price_change_percentage_24h',
        render: (value: number) => <CoinPriceChartTiny goingUp={value > 0} />,
    },
    {
        title: 'Circulating Supply',
        dataIndex: 'circulating_supply',
        key: 'circulating_supply',
    },
];

const getCoinTableColumns = (currency: E_CURRENCY) => COIN_TABLE_COLUMNS.map((el) => el.key === 'current_price' ? {
    ...el,
    render: (text: string) => text + ' ' + currency,
} : el)

const App: FC = () => {
    const [data, setData] = useState<ICoinItem[]>([]);
    console.log(data);
    const [currency, setCurrency] = useState<E_CURRENCY>(E_CURRENCY.USD);
    const [order, setOrder] = useState<E_ORDER>(E_ORDER.MARKET_CAP_DESC);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 10000,
    });
    const [loading, setLoading] = useState<boolean>(true);

    const getData = useCallback(async (page: number, rows: number, currency: E_CURRENCY, order: E_ORDER) => {
        const cryptoData = await axios.get(`${API_URL}/?vs_currency=${currency}&order=${order}&per_page=${rows}&page=${page}&sparkline=false`);
        return cryptoData.data;
    }, []);

    useEffect(() => {
        setLoading(true);
        getData(pagination.current || 1, pagination.pageSize || 10, currency, order)
            .then((cryptoData) => setData(cryptoData))
            .catch(() => {
                setData([]);
                console.error('Error getting data.');
            })
            .finally(() => setLoading(false));
    }, [getData, currency, pagination, order]);

    const handleCurrencyChange = (value: E_CURRENCY) => {
        setCurrency(value);
    };

    const handleOrderChange = (value: E_ORDER) => {
        setOrder(value);
    };

    const handleTableChange: TableProps['onChange'] = (pagination) => {
        setPagination((prevState) => ({
            ...prevState,
            ...pagination,
        }));
    };

    return (
        <Flex gap='middle' vertical style={{ padding: '8px' }}>
            <Title level={2}>Coins & Markets</Title>
            <Flex gap='middle'>
                <Select
                    value={currency}
                    onChange={handleCurrencyChange}
                    options={[{ value: E_CURRENCY.USD, label: 'USD' }, { value: E_CURRENCY.EUR, label: 'EUR' }]}
                />
                <Select
                    value={order}
                    onChange={handleOrderChange}
                    options={[
                        { value: E_ORDER.MARKET_CAP_DESC, label: 'Market cap descending' },
                        { value: E_ORDER.MARKET_CAP_ASC, label: 'Market cap ascending' }
                    ]}
                />
            </Flex>
            <Table
                dataSource={data}
                columns={getCoinTableColumns(currency)}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
                loading={loading}
            />
            <Title level={2}>App Code</Title>
            <CodeMirror value={APP_CODE} extensions={[javascript({ jsx: true })]} />
        </Flex>
    );
};

export default App;
