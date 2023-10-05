import { useCallback, useEffect, useRef, useState } from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { getTableColumnProps, valueToCurrency } from '../helpers/functions'
import { useApi } from '../helpers/api';
import { Header } from '../components/Header';
import { TitlePage } from '../components/TitlePage';
// Sources
import { InputRef, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Sales {
    Product: string
    Load: number
    Sale: number
    Change: number
    Inventory: number
    Total: number
}

interface Transaction {
    Type: string
    Total: number
}

interface GetPreliquidationData {
    preliquidation: Array<{
        Sales: string
        Transactions: string
    }>;
    cod: string;
}

function Home() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData } = useApi();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [sales, setSales] = useState<Array<Sales>>([]);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const getPreliquidation = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetPreliquidationData = await getApiData('Liquidation/GetPreliquidation', true);
            const sales: Array<Sales> = JSON.parse(data.preliquidation[0].Sales);
            setSales(sales);
            setSubtotal(sales.reduce((sum, item) => sum + item.Total, 0));

            const transactions: Array<Transaction> = JSON.parse(data.preliquidation[0].Transactions);
            const income = transactions.filter((item: Transaction)=> item.Type === 'Ingresos')[0];
            const expenese = transactions.filter((item: Transaction)=> item.Type === 'Egresos')[0];
            setIncome(income?.Total || 0);
            setExpense(expenese?.Total || 0);

            setIsLoadingData(false);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            setIsLoadingData(false);
        }
    }, [addToastr, getApiData]);
    
    useEffect(() => {
        getPreliquidation();
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            isHome: true,
            tabOption: 'home'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns: ColumnsType<Sales> = [
        { 
            title: 'Producto', 
            width: 140,
            ...getTableColumnProps('Product', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Cargue', 
            width: 110,
            ...getTableColumnProps('Load', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Venta', 
            width: 110,
            ...getTableColumnProps('Sale', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Cambio', 
            width: 110,
            ...getTableColumnProps('Change', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Stock', 
            width: 110,
            ...getTableColumnProps('Inventory', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Total', 
            width: 120,
            ...getTableColumnProps('Total', searchInput, searchedColumn, setSearchedColumn, 'money')
        }
    ];

    return (
        <>
            <Header />            
            <TitlePage image='liquidations' title='Preliquidación' />
                        
            <Table 
                rowKey={record => record.Product}
                dataSource={sales} 
                columns={columns}
                scroll={{x: 700}}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
                footer={(e)=> 
                    <div>
                        <div className='calculated_value'>
                            SubTotal:
                            <span style={{color: 'var(--green)'}}>
                                {valueToCurrency(subtotal)}
                            </span>
                        </div>
                        <div className='calculated_value'>
                            Ingresos:
                            <span style={{color: 'var(--green)'}}>
                                {valueToCurrency(income)}
                            </span>
                        </div>
                        <div className='calculated_value'>
                            Egresos:
                            <span style={{color: 'var(--tertiary)'}}>
                                {valueToCurrency(expense)}
                            </span>
                        </div>
                        <div className='calculated_value' style={{marginTop: '15px', fontSize: '1.3rem'}}>
                            Total:
                            <span style={{fontWeight: 800, color: 'var(--principal)'}}>
                                {valueToCurrency(subtotal + income - expense)}
                            </span>
                        </div>
                    </div>
                }
            />
        </>
    );
}

export { Home };