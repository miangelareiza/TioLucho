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

interface Detail {
    Product: string
    Load: number
    Sale: number
    Change: number
    Inventory: number
    Total: number    
}

interface Liquidation {
    Id: string
    User: string
    Sales: number
    Incomes: number
    Expenses: number
    Total: number
    Created: string
    Details: Array<Detail>
}

interface GetLiquidationsData {
    liquidations: Array<Liquidation>;
    cod: string;
}

function LiquidationsAdmin() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData } = useApi();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [liquidations, setLiquidations] = useState<Array<Liquidation>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const getLiquidations = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetLiquidationsData = await getApiData('Liquidation/GetLiquidations', true);
            if (!data.liquidations.length) {
                addToastr('No se han creado liquidaciones', 'info');
            }
            setLiquidations(data.liquidations);
            setIsLoadingData(false);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            setIsLoadingData(false);
        }
    }, [addToastr, getApiData]);

    useEffect(() => {
        getLiquidations();
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
    
    const columns: ColumnsType<Liquidation> = [
        { 
            title: 'Usuario', 
            width: 140,
            ...getTableColumnProps('User', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Ingresos', 
            width: 120,
            ...getTableColumnProps('Incomes', searchInput, searchedColumn, setSearchedColumn, 'money')
        },
        { 
            title: 'Egresos', 
            width: 120,
            ...getTableColumnProps('Expenses', searchInput, searchedColumn, setSearchedColumn, 'money')
        },
        { 
            title: 'Ventas', 
            width: 120,
            ...getTableColumnProps('Sales', searchInput, searchedColumn, setSearchedColumn, 'money')
        },
        { 
            title: 'Total', 
            width: 120,
            ...getTableColumnProps('Total', searchInput, searchedColumn, setSearchedColumn, 'money')
        },
        { 
            title: 'Fecha', 
            width: 180,
            ...getTableColumnProps('Created', searchInput, searchedColumn, setSearchedColumn, 'dateTime')
        }
    ];

    const detailsColumns: ColumnsType<Detail> = [        
        { 
            title: 'Producto',
            ...getTableColumnProps('Product', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Cargue',
            ...getTableColumnProps('Load', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Venta',
            ...getTableColumnProps('Sale', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Cambio',
            ...getTableColumnProps('Change', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Stock',
            ...getTableColumnProps('Inventory', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Total',
            ...getTableColumnProps('Total', searchInput, searchedColumn, setSearchedColumn, 'money')
        }     
    ];

    return (
        <>
            <Header />
            <TitlePage image='liquidations' title='Liquidaciones' />

            <Table 
                rowKey={record => record.Id}
                dataSource={liquidations}
                columns={columns}
                expandable={{
                    expandedRowRender: (record) => (
                        <Table
                            rowKey={record => record.Product}
                            dataSource={JSON.parse(record.Details.toString())}
                            columns={detailsColumns}
                            pagination={false}
                            size='small'
                        />
                    )                   
                }}
                scroll={{x: 790}}
                style={{marginBottom: '120px'}}
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />
        </>
    );
}

export { LiquidationsAdmin };