import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BiSolidLayerPlus } from 'react-icons/bi';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { getTableColumnProps } from '../../helpers/functions';
import { Header } from '../../components/Header';
import { TitlePage } from '../../components/TitlePage';
import { Button } from '../../components/Button';
// Sources
import { Table, InputRef } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Inventory {
    Id: string
    User: string
    Product: string
    Stock: string
}

interface GetInventoriesData {
    inventory: Array<Inventory>;
    cod: string;
}

function Inventories() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData } = useApi();
    const navigate = useNavigate();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [inventories, setInventories] = useState<Array<Inventory>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const MemoizedResupply = memo(BiSolidLayerPlus);

    const getInventories = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetInventoriesData = await getApiData('UserInventory/GetInventory', true);
            if (!data.inventory.length) {
                addToastr('Registra tu primer cliente', 'info');
            }
            setInventories(data.inventory);
            setIsLoadingData(false);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            setIsLoadingData(false);
        }
    }, [addToastr, getApiData]);

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            tabOption: 'admin'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        getInventories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href]);
    
    const columns: ColumnsType<Inventory> = [
        { 
            title: 'Usuario', 
            ...getTableColumnProps('User', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Producto', 
            ...getTableColumnProps('Product', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Stock', 
            ...getTableColumnProps('Stock', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Acciones', 
            width: 110,
            render: (value) => (
                <div className='table_action_container'>
                    <MemoizedResupply size={30} color='var(--green)' onClick={()=> handleResupplyInventory(value.Id)} />
                </div>
            )
        }
    ];

    const handleAddInventory = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleResupplyInventory = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`resupply`);
    }, [setIsLoading, navigate]);

    return (
        <>
            <Header />
            <TitlePage image='inventories' title='Inventarios' />

            <Button name='Agregar inventario' type='button' onClick={handleAddInventory} icon='add' template='dark' />
            
            <Table 
                rowKey={record => record.Id}
                dataSource={inventories} 
                columns={columns}
                scroll={{x: 1300}}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />

            <Outlet />
        </>
    );
}

export { Inventories };