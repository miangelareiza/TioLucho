import React, { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
// Styles
import '../styles/Header.css';
// Sources
import imgLogo from '../assets/images/Logo.png';
import imgDefaultUser from '../assets/images/DefaultUser.svg';
import imgMenu0 from '../assets/images/icons/Menu0.svg';
import imgMenu1 from '../assets/images/icons/Menu1.svg';
import { Button } from './Button';

interface Props {
    isLandingPage?: boolean
}

function Header({ isLandingPage }: Props) {
    const { setIsLoading } = useAppStates();
    const navigate = useNavigate();
    const { user, path } = useAuth();
    const imgPath = user?.imageUrl ? `${path}AssetsImages/${user.imageUrl}` : imgDefaultUser;
    
    const handleClickMenu: React.MouseEventHandler<HTMLImageElement> = useCallback((e) => {
        const button = e.currentTarget;
        const menu = e.currentTarget.nextElementSibling as HTMLElement;

        if (menu.style.display === 'none' || menu.style.display === '') {
            if (isLandingPage) {
                button.style.transform = 'rotate(270deg)';
                setTimeout(() => {
                    button.src = imgMenu0;
                }, 400);
            }
            menu.style.display = 'block';
            setTimeout(() => {
                menu.style.height = 'calc(100vh - 90px)';
            }, 100);
        } else {
            if (isLandingPage) {
                button.style.transform = 'rotate(0deg)';
                setTimeout(() => {
                    button.src = imgMenu1;
                }, 400);
            }
            menu.style.height = '0';
            setTimeout(() => {
                menu.style.display = 'none';
            }, 1100);
        }
    }, [isLandingPage]);

    const selectOpt = useCallback((opt: HTMLAnchorElement, type: string) => {
        if (type === 'web') {
            document.querySelectorAll('.opt_web_menu').forEach(element => {
                element.classList.remove('selected');
            });
              
            opt.classList.add('selected');
        } else if (type === 'mobile') {            
            document.querySelectorAll('.opt_mobile_menu').forEach(element => {
                element.classList.remove('selected');
            });

            opt.classList.add('selected');

            setTimeout(() => {
                let menu = opt.parentElement!.parentElement as HTMLElement;
                let button = opt.parentElement!.parentElement!.previousElementSibling as HTMLImageElement;

                button.style.transform = 'rotate(0deg)';
                menu.style.height = '0';
                setTimeout(() => {
                    button.src = imgMenu1;
                }, 400);
                setTimeout(() => {
                    menu.style.display = 'none';
                }, 1100);
            }, 300);
        }
    }, []);

    const handleClickBasicOpt = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, name: string) => {
        const type = e.currentTarget.classList.contains('opt_web_menu') ? 'web' : 'mobile';
        const continer = document.querySelector(`.${name}_section`) as HTMLDivElement;

        selectOpt(e.currentTarget, type);

        if (name) {
            setTimeout(() => {
                window.scrollTo({ top: continer.offsetTop - 110, behavior: 'smooth' });
            }, type === 'mobile' ? 1600 : 300 );
        }
    }, [selectOpt]);

    const handleclickLogo = () => {
        if (isLandingPage) {
            setIsLoading(true);
            navigate('/auth/login');
        }
    }

    const handleclickDelivery = () => {
        window.open('https://api.whatsapp.com/send?phone=573137593407&text=%C2%A1Deseo%20solicitar%20un%20servicio%20a%20domicilio!')
    }

    return (
        <header className={isLandingPage ? 'landingPage_header' : 'managementApp_header'}>
            <div className='header_left'>
                <img onClick={handleclickLogo} src={imgLogo} alt='Logo arepas el Tío Lucho' draggable='false' width='70px' />
                { isLandingPage && <div>
                    <h1>AREPAS</h1>
                    <h2>Tío Lucho</h2>
                </div> }
            </div>
            { isLandingPage && <nav className='header_center'>
                <ul className='web_menu'>
                    <li>
                        <Link className='opt_web_menu selected' to='/' onClick={e => handleClickBasicOpt(e, 'home')}>Inicio</Link>
                    </li>
                    <li>
                        <Link className='opt_web_menu' to='/' onClick={e => handleClickBasicOpt(e, 'us')}>Nosotros</Link>
                    </li>
                    <li>
                        <Link className='opt_web_menu' to='/' onClick={e => handleClickBasicOpt(e, 'contact')}>Contacto</Link>
                    </li>
                    <li>
                        <Link className='opt_web_menu' to='/' onClick={handleclickDelivery}>Domicilios</Link>
                    </li>
                </ul>
            </nav> }
            <nav className='header_rigth'>
                { !isLandingPage && <h3>{user?.name.split(' ')[0]}</h3> }
                <img src={isLandingPage ? imgMenu1 : imgPath} onClick={handleClickMenu} alt='Menu Tío Lucho' draggable='false' width='50px' height='50px' />
                { isLandingPage ? 
                <ul className='mobile_menu'>
                    <li>
                        <Link className='opt_mobile_menu selected' to='/' onClick={ e => handleClickBasicOpt(e, 'home')}>Inicio</Link>
                    </li>
                    <li>
                        <Link className='opt_mobile_menu' to='/' onClick={ e => handleClickBasicOpt(e, 'us')}>Nosotros</Link>
                    </li>
                    <li>
                        <Link className='opt_mobile_menu' to='/' onClick={ e => handleClickBasicOpt(e, 'contact')}>Contacto</Link>
                    </li>
                    <li>
                        <Link className='opt_mobile_menu' to='/' onClick={handleclickDelivery}>Domicilios</Link>
                    </li>
                </ul>
                :
                <div className='mobile_menu'>
                    <img src={imgPath} alt='Imagen de usuario Tío Lucho' draggable='false' width='180px' height='180px' />
                    <h3>{user?.name.split(' ')[0]}</h3>
                    <div>
                        <Button name='Editar perfil' type='button' icon='next' template='dark' />
                        <Button name='Cambiar contraseña' type='button' icon='next' template='dark' />
                    </div>
                </div> }
            </nav>
        </header>
    );
}

export { Header };