import React, { memo, useCallback, useEffect, useState } from 'react';
import { BsQuestionOctagonFill } from 'react-icons/bs';
import { renderToString } from 'react-dom/server';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { useAppStates } from '../../helpers/states';
import { useApi } from '../../helpers/api';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
// Sources
import Swal from 'sweetalert2';

interface NewCategoryData {
    Name: string
}

interface EditCategoryData {
    Category_Id: string
    Name: string
}

function CategoriesForm() {
    const { setIsLoading, addToastr } = useAppStates();
    const { postApiData, getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState('');  
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);

    const getCategory = useCallback(async () => {
        try {
            const data = await getApiData(`Category/GetCategoryById?Category_Id=${params.id}`, true);
            setName(data.category.Name);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/admin/categories');
        }
    }, [getApiData, params, addToastr, navigate]);
    
    useEffect(() => {
        if (params.id) {
            getCategory();
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
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:${params.id ? 'var(--principal)' : 'var(--green)'};'>${params.id ? 'Editar' : 'Crear'}</b> la categoría?</div>`,
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
                    const body: EditCategoryData = {
                        Category_Id: params.id,
                        Name: name
                    };
                    const data: ResponseApi = await postApiData('Category/UpdateCategory', body, true, 'application/json');
                    addToastr(data.rpta);
                    navigate('/home/admin/categories');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            } else {
                try {
                    const body: NewCategoryData = {
                        Name: name
                    };
                    const data: ResponseApi = await postApiData('Category/CreateCategory', body, true, 'application/json');
                    addToastr(data.rpta);
                    navigate('/home/admin/categories');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            }
        }
    }, [params, name, addToastr, navigate, postApiData, MemoizedBsQuestionOctagonFill]);
    
    return (
        <Modal isOpen={openModal} setIsOpen={setOpenModal} closeUrl='/home/admin/categories' name={`${params.id ? 'Editar' : 'Crear'} categoría`}>
            <form className='form_inputs' onSubmit={handleSubmit}>
                <Input type='text' value={name} setValue={setName} name='Nombre' />

                <Button name={`${params.id ? 'Editar' : 'Crear'} categoría`} type='submit' icon='send' />                
            </form>
        </Modal>
    );
}

export { CategoriesForm };