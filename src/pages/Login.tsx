import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';

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

function Login() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const auth = useAuth();
    const [user, setUser] = useState<string>('');
    const [password, setPasword] = useState<string>('');

    useEffect( () => {
        setMenuConfig({
            basic: true,
            active: true,
            path: '/'
        });
        setTimeout(() => {            
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeUser: React.ChangeEventHandler<HTMLInputElement> = e => {
        setUser(e.target.value);
    }

    const handleChangePasword: React.ChangeEventHandler<HTMLInputElement> = e => {
        setPasword(e.target.value);
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {        
        e.preventDefault();        
        
        try {
            const body = {
                'UserName': user,
                'Password': password
            };
            const data = await postApiData('Auth/Login', body, false, 'application/json');
            auth.login(data.appUser, data.token);
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }

    if (auth.user && auth.token) {
        return <Navigate to='/home' />
    }

    return (
        <form className='auth_form' onSubmit={handleSubmit}>
            <Header logoUrl={imgLogo} title='COMIDAS RAPIDAS' titleColor='var(--white)' />
            <h2 className='auth_title'>Iniciar Sesión</h2>
            <input 
                className='auth_input user'
                id='input_user'
                onChange={handleChangeUser} 
                value={user} 
                type='text' 
                placeholder='Ingresa usuario' 
                required
                autoComplete='username'
            />
            <input 
                className='auth_input password' 
                id='input_pass'
                onChange={handleChangePasword} 
                value={password} 
                type='password' 
                placeholder='Ingresa contraseña' 
                required
                autoComplete='off'
            />
            <Button name='Ingresar' type='submit' />
            <Link className='recovery_link' to='/auth/recovery' >¿Olvidaste tu contraseña?</Link>
        </form>
    );
}

export { Login };