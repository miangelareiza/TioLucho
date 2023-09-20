import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { useAuth } from '../helpers/auth';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
// Styles
import '../styles/Auth.css';
// Sources
import imgLogo from '../assets/images/Logo.png';

function Recovery() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const { login, user, token } = useAuth();
    const [userName, setUserName] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [password1, setPassword1] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        setMenuConfig({
            basic: true,
            path: '/auth/login'
        });
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeInput = (e: any, type: string) => {
        switch (type) {
            case 'user':
                setUserName(e.target.value);
                break;
            case 'otp':
                setOtp(e.target.value);
                break;
            case 'pass1':
                setPassword1(e.target.value);
                break;
            case 'pass2':
                setPassword2(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleSubmitUser: React.FormEventHandler<HTMLFormElement> = async (e) => {        
        e.preventDefault();

        try {
            const body = {
                'userName': userName
            };
            const data:ResponseApi = await postApiData('Auth/GetOTP', body, false, 'application/json');
            e.currentTarget.style.display = 'none';
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
            addToastr(data.rpta);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }

    const handleSubmitOTP: React.FormEventHandler<HTMLFormElement> = async (e) => {        
        e.preventDefault();

        if (otp.length !== 6) {            
            addToastr('El codigo debe ser de 6 digitos', 'info');
            return;
        }

        try {
            const body = {
                'userName': userName,
                'codeOTP': otp
            };
            const data = await postApiData('Auth/ValidateOTP', body, false, 'application/json');
            e.currentTarget.style.display = 'none';
            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
            
            setUserId(data.id);
            addToastr(data.rpta);
            setIsLoading(false);  
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }

    const handleSubmitPass: React.FormEventHandler<HTMLFormElement> = async (e) => {        
        e.preventDefault();
        
        if (password1 !== password2) {            
            addToastr('Las contraseñas deben coincidir', 'info');
            return;
        }

        try {
            const body = {
                'user_Id': userId,
                'password': password1,
                'codeOTP': otp
            };
            const data = await postApiData('Auth/ChangePasswordByOTP', body, false, 'application/json');
            addToastr(data.rpta);
            login(data.appUser, data.token);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }
    
    if (user && token) {
        return <Navigate to='/home' />
    }

    return (
        <>
            <form className='auth_form form_user' onSubmit={handleSubmitUser}>
                <Header logoUrl={imgLogo} title='COMIDAS RAPIDAS' titleColor='var(--white)' />
                <h2 className='auth_title'>Restablecer</h2>
                <input 
                    className='auth_input user' 
                    id='input_user'
                    onChange={e =>{ handleChangeInput(e, 'user'); }} 
                    value={userName} 
                    type='text' 
                    placeholder='Ingresa usuario' 
                    required
                    autoComplete='username'
                />
                <Button name='Enviar código' type='submit' />
            </form>

            <form className='auth_form form_code' onSubmit={handleSubmitOTP}>
                <Header logoUrl={imgLogo} title='COMIDAS RAPIDAS' titleColor='var(--white)' />
                <h2 className='auth_title'>Restablecer</h2>
                <input 
                    className='auth_input code' 
                    id='input_code'
                    onChange={e =>{ handleChangeInput(e, 'otp'); }} 
                    value={otp} 
                    type='number' 
                    placeholder='Ingresa código' 
                    required
                    autoComplete='off'
                />
                <Button name='Validar código' type='submit' />
            </form>

            <form className='auth_form form_pass' onSubmit={handleSubmitPass}>
                <Header logoUrl={imgLogo} title='COMIDAS RAPIDAS' titleColor='var(--white)' />
                <h2 className='auth_title'>Restablecer</h2>                
                <input 
                    className='auth_input password'
                    id='input_pass1'
                    onChange={e =>{ handleChangeInput(e, 'pass1'); }} 
                    value={password1} 
                    type='password' 
                    placeholder='Ingresa contraseña' 
                    required
                    autoComplete='off'
                />
                <input 
                    className='auth_input password'
                    id='input_pass2'
                    onChange={e =>{ handleChangeInput(e, 'pass2'); }} 
                    value={password2} 
                    type='password' 
                    placeholder='Confirmar contraseña' 
                    required
                    autoComplete='off'
                />
                <Button name='Cambiar contraseña' type='submit' />
            </form>
        </>        
    );
}

export { Recovery };