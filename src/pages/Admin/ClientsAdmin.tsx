import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Outlet, useNavigate } from 'react-router-dom';
import { TiDelete } from 'react-icons/ti';
import { BiSolidMessageSquareEdit, BiSolidCloudDownload } from 'react-icons/bi';
import { FaDeleteLeft } from 'react-icons/fa6';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { getTableColumnProps } from '../../helpers/functions';
import { Header } from '../../components/Header';
import { TitlePage } from '../../components/TitlePage';
import { Button } from '../../components/Button';
// Sources
import imgLogo from '../../assets/images/LogoQr.png';
import Swal from 'sweetalert2';
import { Table, InputRef, QRCode } from 'antd';
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

function ClientsAdmin() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [clients, setClients] = useState<Array<Client>>([]);
    const [QRCodeId, setQRCodeId] = useState<string>('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const MemoizedTiDelete = memo(TiDelete);
    const MemoizedEdit = memo(BiSolidMessageSquareEdit);
    const MemoizedDelete = memo(FaDeleteLeft);
    const MemoizedDownload = memo(BiSolidCloudDownload);

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
            path: '/home/admin',
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
            width: 140,
            ...getTableColumnProps('Name', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Ruta', 
            width: 110,
            ...getTableColumnProps('Route', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Teléfono', 
            width: 110,
            ...getTableColumnProps('Phone', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Contacto', 
            width: 120,
            ...getTableColumnProps('Contact', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Domicilio', 
            width: 110,
            ...getTableColumnProps('Delivery', searchInput, searchedColumn, setSearchedColumn),
        },
        { 
            title: 'Dirección', 
            width: 150,
            ...getTableColumnProps('Address', searchInput, searchedColumn, setSearchedColumn)
        },
        { 
            title: 'Activo', 
            width: 100,
            ...getTableColumnProps('Active', searchInput, searchedColumn, setSearchedColumn),
        },
        { 
            title: 'Acciones', 
            width: 130,
            render: (value) => (
                <div className='table_action_container'>
                    <MemoizedDownload size={30} color='var(--dark)' onClick={() => handleDownloadQr(value.Id, value.Name)} />
                    <MemoizedEdit size={30} color='var(--principal)' onClick={()=> handleEditClient(value.Id)} />
                    <MemoizedDelete size={30} color='var(--tertiary)' onClick={()=> handleDeleteClient(value.Id)} />
                </div>
            )
        }
    ];
    
    const handleDownloadQr = (id: string, name: string) => {
        setQRCodeId(id);
        setTimeout(() => {
            const qrCodeCanvas = document.querySelector<HTMLCanvasElement>('.QRCode_container canvas');
            
            if (qrCodeCanvas) {
                const qrCodeImage = new Image();
                qrCodeImage.src = qrCodeCanvas.toDataURL();
                
                qrCodeImage.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = qrCodeCanvas.width + 200;
                    canvas.height = qrCodeCanvas.height + 300;
                    const ctx = canvas.getContext('2d');
                    
                    if(ctx?.fillStyle) ctx.fillStyle = '#FFFFFF'
                    ctx?.fillRect(0, 0, canvas.width, canvas.height);

                    if(ctx?.fillStyle) ctx.fillStyle = 'rgba(0, 0, 0)';
                    if(ctx?.font) ctx.font = 'bold 80px Urbanist';
                    const watermarkText = name;
                    const textWidth = ctx?.measureText(watermarkText).width;
                    const textX = (canvas.width - textWidth!) / 2;
                    ctx?.fillText(watermarkText, textX, (canvas.height - 60));

                    ctx?.drawImage(qrCodeImage, 100, 100);
                                    
                    const image = new Image();
                    image.src = imgLogo;
                    image.onload = () => {
                        const centerX = canvas.width / 2 - image.width / 2;
                        const centerY = (canvas.height - 100) / 2 - image.height / 2;
                        ctx?.drawImage(image, centerX, centerY);
                
                        // Descarga el canvas combinado con el logotipo
                        const url = canvas.toDataURL();
                        const a = document.createElement('a');
                        a.download = `QRCode-${name}.png`;
                        a.href = url;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    };
                };
            }
        }, 200);
    }

    const handleAddClient = () => {   
        setIsLoading(true);
        navigate('new');
    };

    const handleEditClient = (id: string) => {
        setIsLoading(true);
        navigate(`edit/${id}`);
    };

    const handleDeleteClient = async (id: string) => {
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
    };

    return (
        <>
            <Header />
            <TitlePage image='clients' title='Clientes' />

            <Button name='Agregar cliente' type='button' onClick={handleAddClient} icon='add' template='dark' />
            <Table 
                rowKey={record => record.Id}
                dataSource={clients} 
                columns={columns}
                scroll={{x: 970}}
                style={{marginBottom: '120px'}} 
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                loading={isLoadingData}
            />

            <div className='QRCode_container' style={{display: 'none'}}>
                <QRCode value={`https://tiolucho.com/#/home/newSale/${QRCodeId.toUpperCase()}`} bordered={false} size={1106} bgColor='#FFFFFF' errorLevel='H' />
            </div>

            <Outlet />
        </>
    );
}

export { ClientsAdmin };