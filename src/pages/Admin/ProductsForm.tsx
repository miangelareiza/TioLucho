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
import Swal from 'sweetalert2';

interface NewProductData {
    Category_Id: string
    Name: string
    Cost: number | string
    Price: number | string
    Active: boolean
}

interface EditProductData {
    Product_Id: string
    Category_Id: string
    Name: string
    Cost: number | string
    Price: number | string
    Active: boolean
}

interface Category {
    Id: string
    Name: string
}

interface GetCategoriesData {
    categories: Array<Category>;
    cod: string;
}

function ProductsForm() {
    const { setIsLoading, addToastr } = useAppStates();
    const { postApiData, getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [category, setCategory] = useState<any>('');
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [price, setPrice] = useState<number | string>('');
    const [active, setActive] = useState(true);   
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);
    const [optsCategory, setOptsCategory] = useState<Array<Category>>([]);

    const getProducts = useCallback(async () => {
        try {
            const data = await getApiData(`Product/GetProductById?Product_Id=${params.id}`, true);
            setCategory(data.product.Category);
            setName(data.product.Name);
            setCost(data.product.Cost);
            setPrice(data.product.Price);
            setActive(data.product.Active);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/admin/products');
        }
    }, [getApiData, params, addToastr, navigate]);
    
    const getCategories = useCallback(async () => {
        if (optsCategory.length !== 0) {
            return;
        }
        try {
            const data: GetCategoriesData = await getApiData('Category/GetCategories', true);
            if (!data.categories.length) {
                addToastr('Registra tu primera categoría', 'info');
            }                            
            setOptsCategory(data.categories);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsCategory, addToastr, getApiData]);

    useEffect(() => {
        getCategories();
        if (params.id) {
            getProducts();
        }
        setTimeout(() => {
            setIsLoading(false);
            setOpenModal(true);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            html: `${renderToString(<MemoizedBsQuestionOctagonFill size={130} color={params.id ? 'var(--principal)' : 'var(--green)'} />)}
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:${params.id ? 'var(--principal)' : 'var(--green)'};'>${params.id ? 'Editar' : 'Crear'}</b> el producto?</div>`,
            showCancelButton: true,
            confirmButtonColor: params.id ? 'var(--principal)' : 'var(--green)',
            confirmButtonText: params.id ? 'Editar' : 'Crear',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-background-custom'
            }
        });

        if (isConfirmed) {
            let costVal = cost.toString().replace(/[^0-9]/g, '');
            let priceVal = price.toString().replace(/[^0-9]/g, '');
            if (costVal > priceVal) {
                addToastr('El costo no puede superar el precio', 'warning');
                return
            }
            if (params.id) {
                try {
                    const body: EditProductData = {
                        Product_Id: params.id,
                        Category_Id: category.value, 
                        Name: name,
                        Cost: cost.toString().replace(/[^0-9]/g, ''),
                        Price: price.toString().replace(/[^0-9]/g, ''),
                        Active: active
                    };
                    const data: ResponseApi = await postApiData('Product/UpdateProduct', body, true, 'application/json');
                    addToastr(data.rpta);
                    navigate('/home/admin/products');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            } else {
                try {
                    const body: NewProductData = {
                        Category_Id: category.value, 
                        Name: name,
                        Cost: cost.toString().replace(/[^0-9]/g, ''),
                        Price: price.toString().replace(/[^0-9]/g, ''),
                        Active: active
                    };
                    const data: ResponseApi = await postApiData('Product/CreateProduct', body, true, 'application/json');
                    addToastr(data.rpta);
                    navigate('/home/admin/products');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            }
        }
    }, [params, category, name, cost, price, active, addToastr, navigate, postApiData, MemoizedBsQuestionOctagonFill]);
    
    return (
        <Modal isOpen={openModal} setIsOpen={setOpenModal} closeUrl='/home/admin/products' name={`${params.id ? 'Editar' : 'Crear'} producto`}>
            <form className='form_inputs' onSubmit={handleSubmit}>
                <Input type='text' value={name} setValue={setName} name='Nombre' />
                <Input type='select' value={category} setValue={setCategory} name='Categoría' options={transformToOptions(optsCategory)} defaultValue={category} /> 
                <Input type='money' value={cost} setValue={setCost} name='Costo' />
                <Input type='money' value={price} setValue={setPrice} name='Precio' />
                <Input type='checkbox' value={active} setValue={setActive} name='Activo' />

                <Button name={`${params.id ? 'Editar' : 'Crear'} producto`} type='submit' icon='send' />                
            </form>
        </Modal>
    );
}

export { ProductsForm };