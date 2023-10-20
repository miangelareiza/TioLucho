import React, { memo, useCallback, useEffect, useState } from 'react';
import { BsQuestionOctagonFill } from 'react-icons/bs';
import { renderToString } from 'react-dom/server';
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { transformToOptions } from '../../helpers/functions';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
// Sources
import Swal from 'sweetalert2';

interface NewInventoryData {
    User_Id: string
    Product_Id: string
    Stock: number
}

interface ResupplyInventoryData {
    User_Id: string
    Product_Id: string
    Reload: number
}

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

function InventoriesForm() {
    const { setIsLoading, addToastr } = useAppStates();
    const { postApiData, getApiData } = useApi();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState<any>('');
    const [product, setProduct] = useState<any>('');
    const [quantity, setQuantity] = useState(1);
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);
    const [optsUser, setOptsUser] = useState<Array<User>>([]);
    const [optsProduct, setOptsProduct] = useState<Array<Product>>([]);
    const location = useLocation();
    const urlName = location.pathname.split('/')[location.pathname.split('/').length -1];
    const isResupply = urlName === 'resupply' ? true : false;

    const getUsers = useCallback(async () => {
        if (optsUser.length !== 0) {
            return;
        }
        try {
            const data: GetUsersData = await getApiData('User/GetUsers', true);
            if (!data.users.length) {
                addToastr('Registra tu primer usuario', 'info');
            }                            
            setOptsUser(data.users);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsUser, addToastr, getApiData]);

    const getProducts = useCallback(async () => {
        if (optsProduct.length !== 0) {
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
    }, [optsProduct, addToastr, getApiData]);

    useEffect(() => {
        getUsers();
        getProducts()
        setTimeout(() => {
            setIsLoading(false);
            setOpenModal(true);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color='var(--green)' />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:var(--green);'>${isResupply ? 'cargar' : 'crear'}</b> el inventario?</div>`,
            showCancelButton: true,
            confirmButtonColor: 'var(--green)',
            confirmButtonText: 'Cargar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            if (isResupply) {
                try {
                    const body: ResupplyInventoryData = {
                        User_Id: user.value, 
                        Product_Id: product.value,
                        Reload: quantity
                    };
                    const data: ResponseApi = await postApiData('UserInventory/ReloadInventory', body, true, 'application/json');
                    addToastr(data.rpta);
                    navigate('/home/admin/inventories');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            } else {
                try {
                    const body: NewInventoryData = {
                        User_Id: user.value, 
                        Product_Id: product.value,
                        Stock: quantity
                    };
                    const data: ResponseApi = await postApiData('UserInventory/CreateUserInventory', body, true, 'application/json');
                    addToastr(data.rpta);
                    navigate('/home/admin/inventories');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            }
        }
    }, [isResupply, user, product, quantity, addToastr, navigate, postApiData, MemoizedBsQuestionOctagonFill]);
    
    return (
        <Modal isOpen={openModal} setIsOpen={setOpenModal} closeUrl='/home/admin/inventories' name={`${isResupply ? 'Cargar' : 'Crear'} inventario`}>
            <form className='form_inputs' onSubmit={handleSubmit}>
                <Input type='select' value={user} setValue={setUser} name='Usuario' options={transformToOptions(optsUser)} defaultValue={user} /> 
                <Input type='select' value={product} setValue={setProduct} name='Producto' options={transformToOptions(optsProduct)} defaultValue={product} /> 
                <Input type='number' value={quantity} setValue={setQuantity} name='Cantidad' />

                <Button name={`${isResupply ? 'Cargar' : 'Crear'} inventario`} type='submit' icon='send' />                
            </form>
        </Modal>
    );
}

export { InventoriesForm };