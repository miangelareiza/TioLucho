import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiRedo } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';
// Styles
import '../styles/Default.css';
// Sources
import imgPage404 from '../assets/images/Page404.png';

function Default() {
    const { setIsLoading, setMenuConfig } = useAppStates();
    const navigate = useNavigate();

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#FEFEFE');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#FEFEFE');

        setMenuConfig({
            active: false
        });
        setTimeout(() => {
            setIsLoading(false);
        }, 300);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClickReturn = useCallback(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');

        setIsLoading(true);
        navigate(-1);
    }, [setIsLoading, navigate]);
    
    return (
        <>
            <img className='default_image' src={imgPage404} alt='Pagina no encontrada arepas del Tío Lucho' draggable='false' width='300px' />
            <h4 className='default_title'>¿Te has perdido?</h4>
            <p className='default_description'>Pagina no disponible</p>
            <button className='default_button' onClick={handleClickReturn} ><BiRedo size={30} color='var(--black)' />Regresar</button>
        </>
    );
}

export { Default };