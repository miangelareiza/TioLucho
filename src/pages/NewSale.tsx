import React, { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { BsQuestionOctagonFill } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { transformToOptions } from '../helpers/functions';
import { Header } from '../components/Header';
import { TitlePage } from '../components/TitlePage';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
// Styles
import '../styles/NewSale.css'
// Sources
import Swal from 'sweetalert2';

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
    Total: number
    Remarks: string
}

function NewSale() {     
    const { setIsLoading, addToastr, setMenuConfig, newId } = useAppStates();
    const { getApiData, postApiData } = useApi();
    const navigate = useNavigate();
    const [client, setClient] = useState<any>();
    const [product, setProduct] = useState<any>('');
    const [sale, setSale] = useState(0);
    const [change, setChange] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [remarksInvoice, setRemarksInvoice] = useState('');
    const [totalInvoice, setTotalInvoice] = useState(0);
    const [optsProducts, setOptsProduct] = useState<Array<Product>>([]);
    const [productsBySale, setProductBySale] = useState<Array<ProductsBySale>>([]);
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);
    const params = useParams();


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
    
    const handleClickAdd = useCallback(() => {
        if (!product) {
            addToastr('Debes seleccionar un producto', 'warning');
            return
        }
        if (!sale || sale < 0 || !change || change < 0) {
            addToastr('Debes seleccionar una cantidad válida', 'warning'); 
            return
        }

        const data = product.complete;        
        const newProducts: Array<ProductsBySale> = [...productsBySale, { Id: newId(), Product: data.Id, Name: data.Name, Sale: sale, Change: change, Total: data.Price * sale, Remarks: remarks}];
        setProductBySale(newProducts);

        setProduct('');
        setSale(0);
        setChange(0);
        setRemarks('');

        const total = newProducts.reduce((acc, product) => {
            return acc + product.Total;
        }, 0);        
        setTotalInvoice(total);
        addToastr('Producto agregado exitosamente');
    }, [addToastr, newId, product, sale, change, remarks, productsBySale]);

    const handleClickDelete = useCallback((id: string) => {
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
				StrRemarks: option.Remarks
			};
		});
	}, []);

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
                    Remark: remarks,
                    productsByInvoice: transformProductsByOrder(productsBySale)
                };
                const data: ResponseApi = await postApiData('Invoice/CreateOrderInvoice', body, true, 'application/json');
                addToastr(data.rpta);

                // Imprimir la factura
                // navigate('/home/admin/routes');
            } catch (error: any) {
                addToastr(error.message, error.type || 'error');
            }
        }
    }, [addToastr, params, remarks, productsBySale, postApiData, transformProductsByOrder, MemoizedBsQuestionOctagonFill])
    
    return (
        <>
            <Header />
            <TitlePage image='sales' title={`Nueva venta a ${client ? client.Name : ''}`} />

            <form className='form_inputs' onSubmit={handleSubmit}>                
                <div className='order_description'>
                    <Input type='select' value={product} setValue={setProduct} name='Producto' options={transformToOptions(optsProducts)} required={false} /> 
                    <Input type='number' value={sale} setValue={setSale} name='Venta' min={0} required={false} />
                    <Input type='number' value={change} setValue={setChange} name='Cambio' min={0} required={false} />
                    <Input type='textarea' name='Comentarios' value={remarks} setValue={setRemarks} required={false} />

                    <Button name='Agregar' type='button' icon='add' onClick={handleClickAdd} />

                    <div className='order_products_container'>
                        <h3><FaShoppingCart size={25} color='var(--principal)' />Tu carrito</h3>
                        <div className='card_container'>
                            { productsBySale[0] ?
                                productsBySale.map( ({Id, Name, Sale, Change, Total, Remarks}) => {
                                    return( 
                                        <Card
                                            key={Id}
                                            onDelete={ () => handleClickDelete(Id)}
                                            type='order'
                                            item={{name: Name, quantity: Sale, total: Total, remarks: remarks}}
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
            </form>
        </>
    );
}

export { NewSale };