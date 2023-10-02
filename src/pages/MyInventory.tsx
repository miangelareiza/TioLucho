import { useCallback, useEffect, useRef, useState } from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { getTableColumnProps } from '../helpers/functions';
import { Header } from '../components/Header';
import { TitlePage } from '../components/TitlePage';
// Sources
import { Table, InputRef } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Inventory {
    Id: string
    Product: string
    Stock: string
}

interface GetInventoryData {
    inventory: Array<Inventory>;
    cod: string;
}

function MyInventory() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData } = useApi();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [inventory, setInventory] = useState<Array<Inventory>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const getInventory = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetInventoryData = await getApiData('UserInventory/GetInventoryByUser', true);
            if (!data.inventory.length) {
                addToastr('No tientes inventario asignado', 'info');
            }
            setInventory(data.inventory);
            setIsLoadingData(false);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            setIsLoadingData(false);
        }
    }, [addToastr, getApiData]);

    useEffect(() => {
        getInventory();
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            tabOption: 'inventory'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const columns: ColumnsType<Inventory> = [
        { 
            title: 'Producto',
            width: 150, 
            ...getTableColumnProps('Product', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Stock',
            width: 150,
            ...getTableColumnProps('Stock', searchInput, searchedColumn, setSearchedColumn)
        }
    ];

    return (
        <>
            <Header />
            <TitlePage image='inventories' title='Inventario' />

            <Table 
                rowKey={record => record.Id}
                dataSource={inventory} 
                columns={columns}
                scroll={{x: 300}}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />
        </>
    );
}

export { MyInventory };