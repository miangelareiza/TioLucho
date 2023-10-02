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

interface Transaction {
    Id: string
    User: string
    Total: number
    Remark: string
    IsIncome: boolean
    Created: string
}

interface GetTransactionsData {
    cashTransactions: Array<Transaction>;
    cod: string;
}

function TransactionsAdmin() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData } = useApi();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [transactions, setTransactions] = useState<Array<Transaction>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const getTransactions = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetTransactionsData = await getApiData('CashTransaction/GetCashTransactions', true);
            if (!data.cashTransactions.length) {
                addToastr('No se han creado registros', 'info');
            }
            setTransactions(data.cashTransactions);
            setIsLoadingData(false);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            setIsLoadingData(false);
        }
    }, [addToastr, getApiData]);

    useEffect(() => {
        getTransactions();
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
    
    const columns: ColumnsType<Transaction> = [
        { 
            title: 'Usuario', 
            width: 140,
            ...getTableColumnProps('User', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Total', 
            width: 100,
            ...getTableColumnProps('Total', searchInput, searchedColumn, setSearchedColumn, 'money')
        },
        { 
            title: 'Detalle', 
            width: 150,
            ...getTableColumnProps('Remark', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Ingreso', 
            width: 110,
            ...getTableColumnProps('IsIncome', searchInput, searchedColumn, setSearchedColumn),
            render: (text, record) => (
                <span style={{ color: record.IsIncome ? 'var(--green)' : 'var(--tertiary)' }}>
                    {record.IsIncome ? 'Ingreso' : 'Egreso'}
                </span>
            )
        },
        { 
            title: 'Fecha', 
            width: 180,
            ...getTableColumnProps('Created', searchInput, searchedColumn, setSearchedColumn, 'dateTime')
        }
    ];

    const rowClassName = (record: Transaction) => {
        return record.IsIncome ? 'income_row' : 'expense_row';
    };

    return (
        <>
            <Header />
            <TitlePage image='transactions' title='Transacciones' />

            <Table 
                rowKey={record => record.Id}
                dataSource={transactions} 
                columns={columns}
                scroll={{x: 680}}
                rowClassName={rowClassName}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />
        </>
    );
}

export { TransactionsAdmin };