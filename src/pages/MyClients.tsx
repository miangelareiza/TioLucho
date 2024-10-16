import { useCallback, useEffect, useRef, useState } from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { useAuth } from '../helpers/auth';
import { getTableColumnProps } from '../helpers/functions';
import { Header } from '../components/Header';
import { TitlePage } from '../components/TitlePage';
// Sources
import { Table, InputRef } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Client {
    Id: string
    Name: string
    Phone: string
    Contact: string
    Address: string
}

interface GetClientsData {
    clients: Array<Client>;
    cod: string;
}

function MyClients() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData } = useApi();
    const { user } = useAuth();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [clients, setClients] = useState<Array<Client>>([]);  
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const getClients = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const data: GetClientsData = await getApiData(`Client/GetClientsByRoute?Route_Id=${user?.routeId}`, true);
            if (!data.clients.length) {
                addToastr('No tienes clientes asignados', 'info');
            }
            setClients(data.clients);
            setIsLoadingData(false);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            setIsLoadingData(false);
        }
    }, [user, addToastr, getApiData]);

    useEffect(() => {
        getClients();
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            tabOption: 'clients'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const columns: ColumnsType<Client> = [
        { 
            title: 'Nombre', 
            width: 150,
            ...getTableColumnProps('Name', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Teléfono', 
            width: 120,
            ...getTableColumnProps('Phone', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Contacto', 
            width: 150,
            ...getTableColumnProps('Contact', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Dirección', 
            width: 150,
            ...getTableColumnProps('Address', searchInput, searchedColumn, setSearchedColumn, 'geolocation')
        }
    ];

    return (
        <>
            <Header />
            <TitlePage image='clients' title='Clientes' />

            <Table 
                rowKey={record => record.Id}
                dataSource={clients} 
                columns={columns}
                scroll={{x: 570}}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />
        </>
    );
}

export { MyClients };