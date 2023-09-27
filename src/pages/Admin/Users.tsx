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

interface User {
    Id: string
    Role: string,
    Route: string,
    ImageUrl: string,
    Name: string,
    User: string,
    Document: string,
    Email: string,
    Phone: string,
    BirthDay: string,
    Gender: string,
    Active: boolean,
}

interface GetUsersData {
    users: Array<User>;
    cod: string;
}

function Users() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [users, setUsers] = useState<Array<User>>([]);
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const MemoizedTiDelete = memo(TiDelete);
    const MemoizedEdit = memo(BiSolidMessageSquareEdit);
    const MemoizedDelete = memo(FaDeleteLeft);

    const getUsers = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetUsersData = await getApiData('User/GetUsers', true);
            if (!data.users.length) {
                addToastr('Registra tu primer usuario', 'info');
            }
            setUsers(data.users);
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
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.href]);
    
    const columns: ColumnsType<User> = [
        { 
            title: 'Foto', 
            width: 80,
            ...getTableColumnProps('ImageUrl', searchInput, searchedColumn, setSearchedColumn, 'photo')
        },
        { 
            title: 'Nombre', 
            ...getTableColumnProps('Name', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Rol', 
            ...getTableColumnProps('Role', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Ruta', 
            ...getTableColumnProps('Route', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Usuario', 
            ...getTableColumnProps('User', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Documento', 
            ...getTableColumnProps('Document', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Correo', 
            ...getTableColumnProps('Email', searchInput, searchedColumn, setSearchedColumn),
        },
        { 
            title: 'Teléfono', 
            ...getTableColumnProps('Phone', searchInput, searchedColumn, setSearchedColumn),
        },
        { 
            title: 'Cumpleaños', 
            ...getTableColumnProps('BirthDay', searchInput, searchedColumn, setSearchedColumn, 'date')
        },
        { 
            title: 'Genero', 
            ...getTableColumnProps('Gender', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Activo', 
            ...getTableColumnProps('Active', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Acciones', 
            width: 110,
            render: (value) => (
                <div className='table_action_container'>
                    <MemoizedEdit size={30} color='var(--principal)' onClick={()=> handleEditUser(value.Id)} />
                    <MemoizedDelete size={30} color='var(--tertiary)' onClick={()=> handleDeleteUser(value.Id)} />
                </div>
            )
        }
    ];

    const handleAddUser = useCallback(() => {   
        setIsLoading(true);
        navigate('new');
    }, [setIsLoading, navigate]);

    const handleEditUser = useCallback((id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    }, [setIsLoading, navigate]);

    const handleDeleteUser = useCallback(async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedTiDelete size={130} color='var(--tertiary)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:var(--tertiary);'>Eliminar</b> el usuario?</div>`,
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
                const body = { 'User_Id': id };
                const data: ResponseApi = await postApiData('User/DeleteUser', body, true, 'application/json');
                setUsers(prevUsers => prevUsers.filter(user => user.Id !== id));              
                addToastr(data.rpta);
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [postApiData, addToastr, MemoizedTiDelete]);

    return (
        <>
            <Header />
            <TitlePage image='users' title='Usuarios' />

            <Button name='Agregar usuario' type='button' onClick={handleAddUser} icon='add' template='dark' />
            
            <Table 
                rowKey={record => record.Id}
                dataSource={users} 
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

export { Users };