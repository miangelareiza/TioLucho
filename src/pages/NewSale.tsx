import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { MdContentPasteOff } from 'react-icons/md';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { useApi } from '../helpers/api';
import { formatDateTime, transformToOptions, valueToCurrency } from '../helpers/functions';
import { Header } from '../components/Header';
import { TitlePage } from '../components/TitlePage';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
// Styles
import '../styles/NewSale.css'
// Sources
import Swal from 'sweetalert2';
import imgLogo from '../assets/images/Logo.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Product {
    Id: string
    Category: string
    Name: string
    Cost: number | string
    Price: number | string
    Active: boolean
}

interface GetProductsData {
    products: Array<Product>;
    cod: string;
}

interface ProductsBySale {
    Id: string
    Product: string
    Name: string
    Sale: number
    Change: number
    Price: number
    Total: number
}

function NewSale() {     
    const { setIsLoading, addToastr, setMenuConfig, newId } = useAppStates();
    const { user } = useAuth();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [client, setClient] = useState<any>();
    const [notSale, setNotSale] = useState<any>('');
    const [product, setProduct] = useState<any>('');
    const [sale, setSale] = useState(0);
    const [change, setChange] = useState(0);
    const [remarksInvoice, setRemarksInvoice] = useState('');
    const [totalInvoice, setTotalInvoice] = useState(0);
    const [price, setPrice] = useState(0);
    const [optsProducts, setOptsProduct] = useState<Array<Product>>([]);
    const [productsBySale, setProductBySale] = useState<Array<ProductsBySale>>([]);
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);
    const params = useParams();
    const optsNotSale = [
        {Id: 'Con inventario', Name: 'Con inventario'},
        {Id: 'Cerrado', Name: 'Cerrado'},
        {Id: 'Sin dinero', Name: 'Sin dinero'},
        {Id: 'Inconforme', Name: 'Inconforme'},
        {Id: 'Cerrado definitivo', Name: 'Cerrado definitivo'}
    ]
    const [serial, setSerial] = useState(0);
    const divRef = useRef<HTMLDivElement>(null);

    const getClient = useCallback(async () => {
        try {
            const data = await getApiData(`Client/GetClientById?Client_Id=${params.clientId}`, true);
            setClient(data.client);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            setTimeout(() => {
                navigate('/home');
            }, 400);
        }
    }, [getApiData, params, addToastr, navigate]);
    
    const getProducts = useCallback(async () => {
        if (optsProducts.length !== 0) {
            return;
        }
        try {
            const data: GetProductsData = await getApiData('Product/GetProducts', true);
            if (!data.products.length) {
                addToastr('Registra tu primer producto', 'info');
            }
            setOptsProduct(data.products);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsProducts, addToastr, getApiData]);

    useEffect(() => {
        getClient()
        getProducts();
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setMenuConfig({
            path: '/home',
            tabOption: 'sale'
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleNotSale: React.MouseEventHandler = useCallback((e) => {
        e.currentTarget.parentElement?.classList.toggle('active');
    }, []);

    const handleSubmitNotSale: React.FormEventHandler = useCallback(async (e) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color='var(--tertiary)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color: var(--tertiary);'>Crear</b> una no venta?</div>`,
            showCancelButton: true,
            confirmButtonColor: 'var(--tertiary)',
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {       
            try {
                const body = {
                    Client_Id: params.clientId,
                    Reason: notSale.value
                };
                const data: ResponseApi = await postApiData('NotSale/CreateNotSale', body, true, 'application/json');
                addToastr(data.rpta);
                navigate('/home');
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [addToastr, navigate, params, notSale, postApiData, MemoizedBsQuestionOctagonFill])
    
    const handleAdd = useCallback(async() => {
        if (!product) {
            addToastr('Debes seleccionar un producto', 'info');
            return
        }
        if (sale < 0 || change < 0 || (!sale && !change)) {
            addToastr('Debes seleccionar una cantidad válida', 'info'); 
            return
        }
        if (productsBySale.filter(item => item.Product.toUpperCase() === product.value.toUpperCase())[0]) {            
            addToastr('Ya agregaste este producto a la factura', 'info');
            return
        }
        if (client.Delivery && !price.toString().replace(/[^0-9]/g, '')) {
            addToastr('El precio es obligatiorio', 'info');            
            return;
        }

        try {
            const body = { Product_Id: product.value };
            const data = await postApiData('UserInventory/ValidateStock', body, true, 'application/json');
            if (data.stock < (Number(sale) + Number(change))) {
                addToastr(`Solo cuentas con ${data.stock} ${product.complete.Name} en tu inventario`, 'info');
                return;
            }

            const prod = product.complete;
            const subTotal = client.Delivery ? Number(price.toString().replace(/[^0-9]/g, '')) * sale : prod.Price * sale
            const newProducts: Array<ProductsBySale> = [...productsBySale, { Id: newId(), Product: prod.Id, Name: prod.Name, Sale: Number(sale), Change: Number(change), Price: Number(price.toString().replace(/[^0-9]/g, '')), Total: subTotal}];
            setProductBySale(newProducts);
    
            setProduct('');
            setSale(0);
            setChange(0);
            setPrice(0);
    
            const total = newProducts.reduce((acc, product) => {
                return acc + product.Total;
            }, 0);        
            setTotalInvoice(total);
            addToastr('Producto agregado exitosamente');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [addToastr, postApiData, client, newId, product, sale, change, price, productsBySale]);

    const handleDelete = useCallback((id: string) => {
        const newProducts = productsBySale.filter( product => product.Id !== id);
        setProductBySale(newProducts);

        const total = newProducts.reduce((acc, product) => {
            return acc + product.Total;
        }, 0);        
        setTotalInvoice(total);
    }, [productsBySale]);

    const transformProductsByOrder = useCallback((data: Array<ProductsBySale>) => {
		return data.map( option => {
			return {
				ProductFk: option.Product,
				IntSale: option.Sale,
                IntChange: option.Change,
                DePrice: Number(option.Price.toString().replace(/[^0-9]/g, ''))
			};
		});
	}, []);

    // const handlePrint = useCallback((serial: string) => {
    //     const details = productsBySale.map(detail => 
    //         `<div>
    //             <h4 style='margin: 0;font-size: .9rem;display: flex;justify-content: space-between;'>${detail.Name}: <b>X${detail.Sale}</b></h4>
    //             <p style='margin: 2px 0 0;font-size: .8rem;display: flex;justify-content: space-between;'>Cambios: ${detail.Change} <b style='font-size: .9rem;'>${valueToCurrency(detail.Total)}</b></p>
    //             <hr>
    //         </div>`
    //     ).join('');
        
    //     const newWindow = window.open('print', `Factura ${client ? client.Name : 'Factura regular'}`, 'width=500,height=500'); 
    //     newWindow?.document.write(`
    //     <head>
    //         <title>Factura ${client ? client.Name : 'Factura regular'}</title>
    //     </head>
    //     <body style='margin: 0;padding: 0;'>
    //         <div style='width: 48mm;display: flex;flex-direction: column;'>
    //             <h1 style='font-size: 1.3rem;margin: 0 auto;'>Factura: # ${serial.toString().padStart(5, '0')}</h1>
    //             ${renderToString(<MdOutlinePointOfSale size={40} color='#000' style={{margin:'2px auto'}}/>)}
    //             <p style='margin: 0;font-size: .8rem;'><b style='margin-right: 10px;'>Cliente:</b>${client ? client.Name : 'Factura regular'}</p>
    //             <p style='margin: 0;font-size: .8rem;'><b style='margin-right: 10px;'>Fecha:</b>${formatDateTime(new Date().toString()).date}</p>
    //             <p style='margin: 0;font-size: .8rem;'><b style='margin-right: 10px;'>Hora:</b>${formatDateTime(new Date().toString()).time}</p>
    //             <p style='margin: 0;font-size: .8rem;'><b style='margin-right: 10px;'>Vendedor:</b>${user?.name}</p>
    //             <h2 style='font-size: 1.2rem;margin: 5px auto;'>Detalles</h2>
    //             ${details}
    //             <h4 style='margin: 4px 0 0;font-size: 1.3rem;display: flex;justify-content: space-between;'>Total:<b>${valueToCurrency(totalInvoice)}</b></h4>
    //             <p style='margin: 5px 0;font-size: .8rem;'>${remarksInvoice}</p>
    //         </div>
    //     </body>`);
    //     setTimeout(() => {
    //         newWindow?.document.close();
    //         newWindow?.focus();
    //         newWindow?.print();
    //         newWindow?.close();            
    //     }, 500);
    // }, [user, client, productsBySale, totalInvoice, remarksInvoice]);

    const handlePDF = useCallback(() => {
        const div = divRef.current;
        html2canvas(div!).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'px', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeigtht = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeigtht = canvas.height;
            const ratio =  Math.min(pdfWidth / imgWidth, pdfHeigtht / imgHeigtht);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeigtht * ratio);
            pdf.save(`Factura${serial}.pdf`);
        })        
    }, [serial]);

    const handleSubmit: React.FormEventHandler = useCallback(async (e) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color='var(--green)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color: var(--green);'>Crear</b> una nueva factura?</div>`,
            showCancelButton: true,
            confirmButtonColor: 'var(--green)',
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {  
            if (!productsBySale) {
                addToastr('Debes ingresar por lo menos un producto', 'warning');
                return
            }         
            try {
                const body = {
                    Client_Id: params.clientId,
                    Remark: remarksInvoice,
                    ProductsByInvoice: transformProductsByOrder(productsBySale),
                    Delivery: client.Delivery
                };
                const data = await postApiData('Invoice/CreateOrderInvoice', body, true, 'application/json');
                addToastr(data.rpta);

                // handlePrint(data.serial);
                setSerial(data.serial);
                setTimeout(() => {
                    handlePDF();
                }, 1000);
                // navigate('/home');
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [addToastr, params, remarksInvoice, productsBySale, client, postApiData, transformProductsByOrder, handlePDF, MemoizedBsQuestionOctagonFill])
    
    return (
        <>
            <Header />
            <TitlePage image='sales' title={client ? client.Name : 'Nueva venta'} />

            <form className='not_sale' onSubmit={handleSubmitNotSale}>
                <MdContentPasteOff size={60} color='var(--tertiary)' onClick={handleNotSale} />
                <div>
                    <Input type='select' value={notSale} setValue={setNotSale} name='Motivo' options={transformToOptions(optsNotSale)} />
                    <Button name='Confirmar' type='submit' template='short' />
                </div>
            </form>
            
            <form className='form_inputs' onSubmit={handleSubmit} style={{marginBottom: '120px'}}>                
                <div className='order_description'>
                    <Input type='select' value={product} setValue={setProduct} name='Producto' options={transformToOptions(optsProducts)} required={false} /> 
                    {client && client.Delivery && <Input type='money' value={price} setValue={setPrice} name='Precio' />}
                    <Input type='number' value={sale} setValue={setSale} name='Cantidad' min={0} required={false} />
                    <Input type='number' value={change} setValue={setChange} name='Cambios' min={0} required={false} />

                    <Button name='Agregar' type='button' icon='add' onClick={handleAdd} />

                    <div className='order_products_container'>
                        <h3><FaShoppingCart size={25} color='var(--principal)' />Tu carrito</h3>
                        <div className='card_container'>
                            { productsBySale[0] ?
                                productsBySale.map( ({Id, Name, Sale, Change, Total}) => {
                                    return( 
                                        <Card
                                            key={Id}
                                            onDelete={ () => handleDelete(Id)}
                                            type='order'
                                            item={{name: Name, sale: Sale, change: Change, total: Total}}
                                        />
                                    )
                                })
                            :
                                <h4>Actualmente no tienes productos en el carrito.</h4>
                            }
                        </div>
                    </div>
                </div>

                <Input name='Total a pagar' type='money' value={totalInvoice} setValue={setTotalInvoice} disabled/>                
                <Input name='Comentarios del pedido' type='textarea' value={remarksInvoice} setValue={setRemarksInvoice} required={false} />

                <Button name='Confirmar pedido' type='submit' icon='next' />
                <div style={{position: 'absolute', zIndex: '-999999999'}}>
                    <div style={{width: '1000px', display: 'flex', flexDirection: 'column', margin: 'auto', padding: '50px'}} ref={divRef}>
                        <h1 style={{fontSize: '2rem', margin: '0 auto'}}>Arepas Del Tío Lucho</h1>
                        <img style={{width: '170px', margin: 'auto'}} src={imgLogo} alt='Logo tio lucho' />
                        <p style={{margin: 0, fontSize: '1.2rem'}}><b style={{marginRight: '10px'}}>NIT:</b>1036612492-2</p>
                        <p style={{margin: 0, fontSize: '1.2rem'}}><b style={{marginRight: '10px'}}>Whatsapp:</b>3137593407</p>
                        <h1 style={{fontSize: '2rem', margin: '0 auto'}}>Factura: # {serial.toString().padStart(4, '0')}</h1>
                        <p style={{margin: 0, fontSize: '1.1rem'}}><b style={{marginRight: '10px'}}>Cliente:</b>{client ? client.Name : 'Factura regular'}</p>
                        <p style={{margin: 0, fontSize: '1.1rem'}}><b style={{marginRight: '10px'}}>Fecha:</b>{formatDateTime(new Date().toString()).date}</p>
                        <p style={{margin: 0, fontSize: '1.1rem'}}><b style={{marginRight: '10px'}}>Hora:</b>{formatDateTime(new Date().toString()).time}</p>
                        <p style={{margin: 0, fontSize: '1.1rem'}}><b style={{marginRight: '10px'}}>Vendedor:</b>{user?.name}</p>
                        <h2 style={{fontSize: '1.5rem', margin: '10px auto'}}>Detalles</h2>
                        {productsBySale.map(detail => (                            
                            <div>
                                <h4 style={{margin: 0, fontSize: '1.3rem', display: 'flex', justifyContent: 'space-between'}}>{detail.Name}: <b>X{detail.Sale}</b></h4>
                                <p style={{margin: '2px 0 0', fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between'}}>Cambios: {detail.Change} <b style={{fontSize: '1.3rem'}}>{valueToCurrency(detail.Total)}</b></p>
                                <hr />
                            </div>
                        ))}
                        <h4 style={{margin: '20px 0', fontSize: '1.8rem', display: 'flex', justifyContent: 'space-between'}}>Total:<b>{valueToCurrency(totalInvoice)}</b></h4>
                        <p style={{margin: 0, fontSize: '1.1rem'}}>{remarksInvoice}</p>
                    </div>
                </div>
            </form>

        </>
    );
}

export { NewSale };