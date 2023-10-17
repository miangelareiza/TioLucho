import React, { memo, useCallback, useEffect, useState } from 'react';
import { BsQuestionOctagonFill } from 'react-icons/bs';
import { renderToString } from 'react-dom/server';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { transformToOptions } from '../../helpers/functions';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
// Sources
import imgLogo from '../../assets/images/LogoQr.png';
import Swal from 'sweetalert2';
import { QRCode } from 'antd';

interface NewClientData {
    Route_Id: string
    Name: string
    Phone: string
    Contact: string
    Address: string
    Active: boolean
    Delivery: boolean
}

interface EditClientData {
    Client_Id: string
    Route_Id: string
    Name: string
    Phone: string
    Contact: string
    Address: string
    Active: boolean
    Delivery: boolean
}

interface Route {
    Id: string
    Name: string
    Description: string
}

interface GetRoutesData {
    routes: Array<Route>;
    cod: string;
}

function ClientsForm() {
    const { setIsLoading, addToastr } = useAppStates();
    const { postApiData, getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [route, setRoute] = useState<any>('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [active, setActive] = useState(true);
    const [delivery, setDelivery] = useState(false);    
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);
    const [optsRoute, setOptsRoute] = useState<Array<Route>>([]);
    const [QRCodeSize, setQRCodeSize] = useState(180);

    const getClient = useCallback(async () => {
        try {
            const data = await getApiData(`Client/GetClientById?Client_Id=${params.id}`, true);
            setRoute(data.client.Route);
            setName(data.client.Name);
            setPhone(data.client.Phone);
            setContact(data.client.Contact);
            setAddress(data.client.Address);
            setActive(data.client.Active);
            setDelivery(data.client.Delivery);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/admin/clients');
        }
    }, [getApiData, params, addToastr, navigate]);
    
    const getRoutes = useCallback(async () => {
        if (optsRoute.length !== 0) {
            return;
        }
        try {
            const data: GetRoutesData = await getApiData('Route/GetRoutes', true);
            if (!data.routes.length) {
                addToastr('Registra tu primera ruta', 'info');
            }                            
            setOptsRoute(data.routes);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsRoute, addToastr, getApiData]);

    useEffect(() => {
        getRoutes();
        if (params.id) {
            getClient();
        }
        setTimeout(() => {
            setIsLoading(false);
            setOpenModal(true);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const downloadQRCode = () => {
        setQRCodeSize(1106);
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
                    
                    if(ctx?.fillStyle) ctx.fillStyle = '#FFFFFF';
                    ctx?.fillRect(0, 0, canvas.width, canvas.height);

                    if(ctx?.fillStyle) ctx.fillStyle = 'rgba(0, 0, 0)';
                    if(ctx?.font) ctx.font = 'bold 50px Urbanist';
                    const watermarkText = name.toUpperCase();
                    const textWidth = ctx?.measureText(watermarkText).width;
                    const textX = (canvas.width - textWidth!) / 2;
                    ctx?.fillText(watermarkText, textX, (canvas.height - 75));

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
                        setQRCodeSize(180);
                    };
                };
            }
        }, 100);
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color={params.id ? 'var(--principal)' : 'var(--green)'} />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:${params.id ? 'var(--principal)' : 'var(--green)'};'>${params.id ? 'Editar' : 'Crear'}</b> el cliente?</div>`,
            showCancelButton: true,
            confirmButtonColor: params.id ? 'var(--principal)' : 'var(--green)',
            confirmButtonText: params.id ? 'Editar' : 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            if (params.id) {
                try {
                    const body: EditClientData = {
                        Client_Id: params.id,
                        Route_Id: route.value, 
                        Name: name,
                        Phone: phone,
                        Contact: contact,
                        Address: address,
                        Active: active,
                        Delivery: delivery
                    };
                    const data: ResponseApi = await postApiData('Client/UpdateClient', body, true, 'application/json');
                    addToastr(data.rpta);
                    navigate('/home/admin/clients');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            } else {
                try {
                    const body: NewClientData = {
                        Route_Id: route.value, 
                        Name: name,
                        Phone: phone,
                        Contact: contact,
                        Address: address,
                        Active: active,
                        Delivery: delivery
                    };
                    const data: ResponseApi = await postApiData('Client/CreateClient', body, true, 'application/json');
                    addToastr(data.rpta);
                    navigate('/home/admin/clients');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            }
        }
    }, [params, route, name, phone, contact, address, active, delivery, addToastr, navigate, postApiData, MemoizedBsQuestionOctagonFill]);
    
    return (
        <Modal isOpen={openModal} setIsOpen={setOpenModal} closeUrl='/home/admin/clients' name={`${params.id ? 'Editar' : 'Crear'} cliente`}>
            <form className='form_inputs' onSubmit={handleSubmit}>
                {params.id && <div className='QRCode_container'>
                    <QRCode value={`https://tiolucho.com/#/home/newSale/${params.id}`} bordered={false} size={QRCodeSize} bgColor='#FFFFFF' errorLevel='H' />
                    <Button name='Descargar' type='button' template='short dark' onClick={downloadQRCode} />
                </div>}

                <Input type='text' value={name} setValue={setName} name='Nombre' />
                <Input type='select' value={route} setValue={setRoute} name='Ruta' options={transformToOptions(optsRoute)} defaultValue={route} /> 
                <Input type='tel' value={phone} setValue={setPhone} name='Teléfono' />
                <Input type='text' value={contact} setValue={setContact} name='Contacto' />
                <Input type='geolocation' value={address} setValue={setAddress}  name='Dirección' />
                <Input type='checkbox' value={delivery} setValue={setDelivery} name='Domicilio' />
                <Input type='checkbox' value={active} setValue={setActive} name='Activo' />

                <Button name={`${params.id ? 'Editar' : 'Crear'} cliente`} type='submit' icon='send' />                
            </form>
        </Modal>
    );
}

export { ClientsForm };