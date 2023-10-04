import { useEffect } from 'react';

// Components
import { useAppStates } from '../helpers/states';
import { Header } from '../components/Header';
import { TitlePage } from '../components/TitlePage';
import { Table } from 'antd';

function Home() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    // const [isLoadingData, setIsLoadingData] = useState(true); 4
    // const [clients, setClients] = useState<Array<Client>>([]);  
    // const [searchedColumn, setSearchedColumn] = useState('');
    // const searchInput = useRef<InputRef>(null);

    // const getClients = useCallback(async () => {
    //     setIsLoadingData(true);
    //     try {
    //         const data: GetClientsData = await getApiData(`Client/GetClientsByRoute?Route_Id=${user?.routeId}`, true);
    //         if (!data.clients.length) {
    //             addToastr('No tienes clientes asignados', 'info');
    //         }
    //         setClients(data.clients);
    //         setIsLoadingData(false);
    //     } catch (error: any) {
    //         addToastr(error.message, error.type || 'error');
    //         setIsLoadingData(false);
    //     }
    // }, [user, addToastr, getApiData]);

    // useEffect(() => {
    //     // getClients();
    //     document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
    //     document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
    //     setMenuConfig({
    //         tabOption: 'clients'
    //     });

    //     setTimeout(() => {
    //         setIsLoading(false);
    //     }, 300);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);
    
    // const columns: ColumnsType<Client> = [
    //     { 
    //         title: 'Nombre', 
    //         width: 150,
    //         ...getTableColumnProps('Name', searchInput, searchedColumn, setSearchedColumn)
    //     },
    //     { 
    //         title: 'Teléfono', 
    //         width: 120,
    //         ...getTableColumnProps('Phone', searchInput, searchedColumn, setSearchedColumn)
    //     },
    //     { 
    //         title: 'Contacto', 
    //         width: 150,
    //         ...getTableColumnProps('Contact', searchInput, searchedColumn, setSearchedColumn)
    //     },
    //     { 
    //         title: 'Dirección', 
    //         width: 150,
    //         ...getTableColumnProps('Address', searchInput, searchedColumn, setSearchedColumn)
    //     }
    // ];

    useEffect(() => {
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

    return (
        <>
            <Header />            
            <TitlePage image='liquidations' title='Preliquidación' />
            
            
            {/* <Table 
                rowKey={record => record.Id}
                dataSource={clients} 
                columns={columns}
                scroll={{x: 570}}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            /> */}
        </>
    );
}

export { Home };