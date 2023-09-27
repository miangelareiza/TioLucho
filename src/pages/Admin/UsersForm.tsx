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

interface NewUserData {
    Role_Id: string
    Route_Id: string
    Image: File | string | null
    Name: string
    UserName: string
    Password: string
    Document: string
    Email: string
    Phone: string
    BirthDate: string
    Gender: string
    Active: boolean
}

interface EditUserData {
    User_Id: string
    Role_Id: string
    Route_Id: string
    Image: File | string | null
    Name: string
    UserName: string
    Password: string
    Document: string
    Email: string
    Phone: string
    BirthDate: string
    Gender: string
    Active: boolean
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

interface Role {
    Id: string
    Name: string
    Description: string
}

interface GetRolesData {
    roles: Array<Role>;
    cod: string;
}

function UsersForm() {
    const { setIsLoading, addToastr } = useAppStates();
    const { postApiData, getApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [role, setRole] = useState<any>([]);
    const [route, setRoute] = useState<any>([]);
    const [image, setImage] = useState<File | string | null>(null);
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [document, setDocument] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [gender, setGender] = useState('');
    const [active, setActive] = useState(false);  
    const MemoizedBsQuestionOctagonFill = memo(BsQuestionOctagonFill);
    const [optsRole, setOptsRole] = useState<Array<Role>>([]);
    const [optsRoute, setOptsRoute] = useState<Array<Route>>([]);

    const getUser = useCallback(async () => {
        try {
            const data = await getApiData(`User/GetUserById?User_Id=${params.id}`, true);
            setRole(data.user.Role);
            setRoute(data.user.Route);
            setImage(data.user.ImageUrl);
            setName(data.user.Name);
            setUserName(data.user.User);
            setDocument(data.user.Document);
            setEmail(data.user.Email);
            setPhone(data.user.Phone);
            setBirthDate(new Date(data.user.BirthDay).toISOString().slice(0, 10));
            setGender(data.user.Gender);
            setActive(data.user.Active);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
            navigate('/home/admin/users');
        }
    }, [getApiData, params, addToastr, navigate]);
        
    const getRoles = useCallback(async () => {
        if (optsRole.length !== 0) {
            return;
        }
        try {
            const data: GetRolesData = await getApiData('Role/GetRoles', true);
            if (!data.roles.length) {
                addToastr('Registra tu primer rol', 'info');
            }                            
            setOptsRole(data.roles);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }, [optsRole, addToastr, getApiData]);

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
        getRoles();
        getRoutes();
        if (params.id) {
            getUser();
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
                   <div style='font-size: 1.5rem; font-weight: 700;'>¿Estas seguro de <b style='color:${params.id ? 'var(--principal)' : 'var(--green)'};'>${params.id ? 'Editar' : 'Crear'}</b> el usuario?</div>`,
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
                    const body: EditUserData = {
                        User_Id: params.id,
                        Role_Id: role.value,
                        Route_Id: route.value, 
                        Image: image,
                        Name: name,
                        UserName: userName,
                        Password: password,
                        Document: document,
                        Email: email,
                        Phone: phone,
                        BirthDate: birthDate,
                        Gender: gender,
                        Active: active
                    };
                    const data: ResponseApi = await postApiData('User/UpdateUser', body, true, 'multipart/form-data');
                    addToastr(data.rpta);
                    navigate('/home/admin/users');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            } else {
                try {
                    const body: NewUserData = {
                        Role_Id: role.value,
                        Route_Id: route.value, 
                        Image: image,
                        Name: name,
                        UserName: userName,
                        Password: password,
                        Document: document,
                        Email: email,
                        Phone: phone,
                        BirthDate: birthDate,
                        Gender: gender,
                        Active: active
                    };
                    const data: ResponseApi = await postApiData('User/CreateUser', body, true, 'multipart/form-data');
                    addToastr(data.rpta);
                    navigate('/home/admin/users');
                } catch (error: any) {
                    addToastr(error.message, error.type || 'error');
                }
            }
        }
    }, [params, role, route, image, name, userName, password, document, email, phone, birthDate, gender, active, addToastr, navigate, postApiData, MemoizedBsQuestionOctagonFill]);
    
    return (
        <Modal isOpen={openModal} setIsOpen={setOpenModal} closeUrl='/home/admin/users' name={`${params.id ? 'Editar' : 'Crear'} usuario`}>
            <form className='form_inputs' onSubmit={handleSubmit}>
                <Input type='photo' value={image} setValue={setImage} name='Imagen' required={false}  />
                <Input type='text' value={name} setValue={setName} name='Nombre' />
                <Input type='select' value={role} setValue={setRole} name='Role' options={transformToOptions(optsRole)} defaultValue={role} /> 
                <Input type='select' value={route} setValue={setRoute} name='Ruta' options={transformToOptions(optsRoute)} defaultValue={route} /> 
                <Input type='text' value={userName} setValue={setUserName} name='Usuario' />
                <Input type='password' value={password} setValue={setPassword} name='Contraseña' required={false} />
                <Input type='text' value={document} setValue={setDocument} name='Document' />
                <Input type='email' value={email} setValue={setEmail} name='Email' />
                <Input type='tel' value={phone} setValue={setPhone} name='Teléfono' />
                <Input type='date' value={birthDate} setValue={setBirthDate} name='Cumpleaños' />
                <Input type='text' value={gender} setValue={setGender} name='Genero' />
                <Input type='checkbox' value={active} setValue={setActive} name='Activo' />

                <Button name={`${params.id ? 'Editar' : 'Crear'} usuario`} type='submit' icon='send' />                
            </form>
        </Modal>
    );
}

export { UsersForm };