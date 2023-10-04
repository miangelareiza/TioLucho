import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { useAuth } from '../helpers/auth';
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
            isBasic: true,
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
            (e.target as HTMLFormElement).style.display = 'none';
            ((e.target as HTMLFormElement).nextElementSibling as HTMLElement).style.display = 'block';
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
            (e.target as HTMLFormElement).style.display = 'none';
            ((e.target as HTMLFormElement).nextElementSibling as HTMLElement).style.display = 'block';
            
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

            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
            document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
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
                <img className='auth_image' src={imgLogo} alt="Logo Tío Lucho" draggable='false' width='140px' />
                <h2 className='auth_title'>Recuperar contraseña</h2>
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
                <Button name='Enviar código' type='submit' icon='next' />
            </form>

            <form className='auth_form form_code' onSubmit={handleSubmitOTP}>
                <img className='auth_image' src={imgLogo} alt="Logo Tío Lucho" draggable='false' width='140px' />
                <h2 className='auth_title'>Recuperar contraseña</h2>
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
                <Button name='Validar código' type='submit' icon='next' />
            </form>

            <form className='auth_form form_pass' onSubmit={handleSubmitPass}>
                <img className='auth_image' src={imgLogo} alt="Logo Tío Lucho" draggable='false' width='140px' />
                <h2 className='auth_title'>Recuperar contraseña</h2>               
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
                <Button name='Cambiar contraseña' type='submit' icon='next' />
            </form>
        </>        
    );
}

export { Recovery };