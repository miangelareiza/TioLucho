import { useCallback, useEffect, useRef, useState } from 'react';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { getTableColumnProps } from '../../helpers/functions';
import { Header } from '../../components/Header';
import { TitlePage } from '../../components/TitlePage';
// Sources
import { Table, InputRef } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface NotSale {
    Id: string
    User: string
    Client: string
    Reason: string
    Created: string
}

interface GetNotSalesData {
    notSales: Array<NotSale>;
    cod: string;
}

function NotSalesAdmin() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData } = useApi();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [notSales, setNotSales] = useState<Array<NotSale>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const getNotSales = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetNotSalesData = await getApiData('NotSale/GetNotSales', true);
            if (!data.notSales.length) {
                addToastr('No se han creado no ventas', 'info');
            }
            setNotSales(data.notSales);
            setIsLoadingData(false);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            setIsLoadingData(false);
        }
    }, [addToastr, getApiData]);

    useEffect(() => {
        getNotSales();
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            path: '/home/admin',
            tabOption: 'admin'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const columns: ColumnsType<NotSale> = [
        { 
            title: 'Cliente', 
            width: 140,
            ...getTableColumnProps('Client', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Motivo', 
            width: 150,
            ...getTableColumnProps('Reason', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Usuario', 
            width: 140,
            ...getTableColumnProps('User', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Fecha', 
            width: 180,
            ...getTableColumnProps('Created', searchInput, searchedColumn, setSearchedColumn, 'dateTime')
        }
    ];

    return (
        <>
            <Header />
            <TitlePage image='notSales' title='No ventas' />

            <Table 
                rowKey={record => record.Id}
                dataSource={notSales} 
                columns={columns}
                scroll={{x: 680}}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />
        </>
    );
}

export { NotSalesAdmin };