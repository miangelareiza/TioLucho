import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Outlet, useNavigate } from 'react-router-dom';
import { TiDelete } from 'react-icons/ti';
import { BiSolidMessageSquareEdit } from 'react-icons/bi';
import { FaDeleteLeft } from 'react-icons/fa6';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { getTableColumnProps } from '../../helpers/functions';
import { Header } from '../../components/Header';
import { TitlePage } from '../../components/TitlePage';
import { Button } from '../../components/Button';
// Sources
import Swal from 'sweetalert2';
import { Table, InputRef } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Route {
    Id: string
    Name: string
    Description: string
}

interface GetRoutesData {
    routes: Array<Route>;
    cod: string;
}

function Routes() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [routes, setRoutes] = useState<Array<Route>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const MemoizedTiDelete = memo(TiDelete);
    const MemoizedEdit = memo(BiSolidMessageSquareEdit);
    const MemoizedDelete = memo(FaDeleteLeft);

    const getRoutes = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetRoutesData = await getApiData('Route/GetRoutes', true);
            if (!data.routes.length) {
                addToastr('Registra tu primer ruta', 'info');
            }
            setRoutes(data.routes);
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
            path: '/home/admin',
            tabOption: 'admin'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        getRoutes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href]);
    
    const columns: ColumnsType<Route> = [
        { 
            title: 'Nombre', 
            width: 120,
            ...getTableColumnProps('Name', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Descripción', 
            width: 140,
            ...getTableColumnProps('Description', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Acciones', 
            width: 110,
            render: (value) => (
                <div className='table_action_container'>
                    <MemoizedEdit size={30} color='var(--principal)' onClick={()=> handleEditRoute(value.Id)} />
                    <MemoizedDelete size={30} color='var(--tertiary)' onClick={()=> handleDeleteRoute(value.Id)} />
                </div>
            )
        }
    ];

    const handleAddRoute = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditRoute = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteRoute = useCallback(async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--tertiary)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:var(--tertiary);'>Eliminar</b> la ruta?</div>`,
            showCancelButton: true,
            confirmButtonColor: 'var(--tertiary)',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            try {
                const body = { 'Route_Id': id};
                const data: ResponseApi = await postApiData('Route/DeleteRoute', body, true, 'application/json');
                setRoutes(prevRoutes => prevRoutes.filter(route => route.Id !== id));              
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr, MemoizedTiDelete]);

    return (
        <>
            <Header />
            <TitlePage image='routes' title='Rutas' />

            <Button name='Agregar ruta' type='button' onClick={handleAddRoute} icon='add' template='dark' />
            
            <Table 
                rowKey={record => record.Id}
                dataSource={routes} 
                columns={columns}
                scroll={{x: 370}}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />

            <Outlet />
        </>
    );
}

export { Routes };