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

interface NewRouteData {
    Name: string
    Description: string
}

interface EditRouteData {
    Route_Id: string
    Name: string
    Description: string
}

function RoutesForm() {
    const { setIsLoading, addToastr } = useAppStates();
    const { postApiData, getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState('');  
    const [description, setDescription] = useState('');
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);

    const getRoute = useCallback(async () => {
        try {
            const data = await getApiData(`Route/GetRouteById?Route_Id=${params.id}`, true);
            setName(data.route.Name);
            setDescription(data.route.Description);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/admin/routes');
        }
    }, [getApiData, params, addToastr, navigate]);
    
    useEffect(() => {
        if (params.id) {
            getRoute();
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
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:${params.id ? 'var(--principal)' : 'var(--green)'};'>${params.id ? 'Editar' : 'Crear'}</b> la ruta?</div>`,
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
                    const body: EditRouteData = {
                        Route_Id: params.id,
                        Name: name,
                        Description: description
                    };
                    const data: ResponseApi = await postApiData('Route/UpdateRoute', body, true, 'application/json');
                    addToastr(data.rpta);
                    navigate('/home/admin/routes');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            } else {
                try {
                    const body: NewRouteData = {
                        Name: name,
                        Description: description
                    };
                    const data: ResponseApi = await postApiData('Route/CreateRoute', body, true, 'application/json');
                    addToastr(data.rpta);
                    navigate('/home/admin/routes');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            }
        }
    }, [params, name, description, addToastr, navigate, postApiData, MemoizedBsQuestionOctagonFill]);
    
    return (
        <Modal isOpen={openModal} setIsOpen={setOpenModal} closeUrl='/home/admin/routes' name={`${params.id ? 'Editar' : 'Crear'} ruta`}>
            <form className='form_inputs' onSubmit={handleSubmit} style={{flexDirection: 'column', alignItems: 'center'}}>
                <Input type='text' value={name} setValue={setName} name='Nombre' />
                <Input type='textarea' value={description} setValue={setDescription} name='Descripcion' />

                <Button name={`${params.id ? 'Editar' : 'Crear'} ruta`} type='submit' icon='send' />                
            </form>
        </Modal>
    );
}

export { RoutesForm };