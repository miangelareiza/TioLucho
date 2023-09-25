import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useApi } from '../helpers/api';
import { Button } from '../components/Button';
// Styles
import '../styles/Auth.css';
// Sources
import imgLogo from '../assets/images/Logo.png';

function ConfirmEmail() {
    const { setIsLoading, addToastr, setMenuConfig } = useAppStates();
    const { postApiData } = useApi();
    const params = useParams();
    const navigate = useNavigate();

    useEffect( () => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#FEFEFE');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#FEFEFE');

        setMenuConfig({
            basic: true,
            path: '/auth/login'
        });
        setTimeout(() => {            
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {        
        e.preventDefault();
        
        try {
            const body = {
                'user_Id': params.id
            };
            const data = await postApiData('Auth/EmailConfirm', body, false, 'application/json');
            addToastr(data.rpta);
            navigate('/auth/login');
        } catch (error: any) {
            addToastr(error.message, error.type || 'error');
        }
    }

    return (
        <form className='auth_form' onSubmit={handleSubmit}>            
            <img className='auth_image' src={imgLogo} alt="Logo Tío Lucho" draggable='false' width='140px' />
            <h2 className='auth_title'>Confirmar Email</h2>
            
            <Button name='Confirmar' type='submit' icon='next' />
        </form>
    );
}

export { ConfirmEmail };