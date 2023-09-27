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

interface Client {
    Id: string
    Route: string
    Name: string
    Phone: string
    Contact: string
    Address: string
    Active: boolean
    Delivery: boolean
}

interface GetClientsData {
    clients: Array<Client>;
    cod: string;
}

function Inventories() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [clients, setClients] = useState<Array<Client>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const MemoizedTiDelete = memo(TiDelete);
    const MemoizedEdit = memo(BiSolidMessageSquareEdit);
    const MemoizedDelete = memo(FaDeleteLeft);

    const getClients = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetClientsData = await getApiData('Client/GetClients', true);
            if (!data.clients.length) {
                addToastr('Registra tu primer cliente', 'info');
            }
            setClients(data.clients);
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
        getClients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href]);
    
    const columns: ColumnsType<Client> = [
        { 
            title: 'Nombre', 
            ...getTableColumnProps('Name', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Ruta', 
            ...getTableColumnProps('Route', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Teléfono', 
            ...getTableColumnProps('Phone', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Contacto', 
            ...getTableColumnProps('Contact', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Es domicilio', 
            ...getTableColumnProps('Delivery', searchInput, searchedColumn, setSearchedColumn),
        },
        { 
            title: 'Dirección', 
            ...getTableColumnProps('Address', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Activo', 
            ...getTableColumnProps('Active', searchInput, searchedColumn, setSearchedColumn),
        },
        { 
            title: 'Acciones', 
            width: 110,
            render: (value) => (
                <div className='table_action_container'>
                    <MemoizedEdit size={30} color='var(--principal)' onClick={()=> handleEditClient(value.Id)} />
                    <MemoizedDelete size={30} color='var(--tertiary)' onClick={()=> handleDeleteClient(value.Id)} />
                </div>
            )
        }
    ];

    const handleAddClient = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditClient = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteClient = useCallback(async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--tertiary)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:var(--tertiary);'>Eliminar</b> el cliente?</div>`,
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
                const body = { 'Client_Id': id};
                const data: ResponseApi = await postApiData('Client/DeleteClient', body, true, 'application/json');
                setClients(prevClients => prevClients.filter(client => client.Id !== id));              
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr, MemoizedTiDelete]);

    return (
        <>
            <Header />
            <TitlePage image='clients' title='Clientes' />

            <Button name='Agregar cliente' type='button' onClick={handleAddClient} icon='add' template='dark' />
            
            <Table 
                rowKey={record => record.Id}
                dataSource={clients} 
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