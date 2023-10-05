import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill } from 'react-icons/bs';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { getTableColumnProps, valueToCurrency } from '../helpers/functions'
import { Header } from '../components/Header';
import { TitlePage } from '../components/TitlePage';
// Sources
import { InputRef, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Button } from '../components/Button';
import Swal from 'sweetalert2';

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
    const { getApiData, postApiData } = useApi();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [sales, setSales] = useState<Array<Sales>>([]);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);
    
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

    const handleLiquidate = useCallback(async () => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color='var(--tertiary)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:var(--tertiary);'>Generar</b> la liquidación?</div>`,
            showCancelButton: true,
            confirmButtonColor: 'var(--tertiary)',
            confirmButtonText: 'Generar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            try {
                const data: ResponseApi = await postApiData('Liquidation/CreateLiquidation', {}, true, 'application/json');
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr, MemoizedBsQuestionOctagonFill]);

    return (
        <>
            <Header />            
            <TitlePage image='liquidations' title='Preliquidación' />
                   
            <Button name='Liquidar' type='button' onClick={handleLiquidate} icon='send' template='dark' />

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
                            Ventas:
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