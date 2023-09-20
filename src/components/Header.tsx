import React, { useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

// Components
import { useAppStates } from '../helpers/states';
// Styles
import '../styles/Header.css';
// Sources
import imgLogo from '../assets/images/Logo.png';
import imgMenu0 from '../assets/images/icons/Menu0.svg';
import imgMenu1 from '../assets/images/icons/Menu1.svg';

interface Props {
    isLandingPage?: boolean
    logoUrl?: string
    title?: string
    titleColor?: string
}

function Header({ isLandingPage, logoUrl, title, titleColor = 'var(--principal)'}: Props) {
    const { setIsLoading } = useAppStates();
    const navigate = useNavigate();
    const location = useLocation();
    const prefix = location.pathname.includes('/new') ? 'Crear ' : location.pathname.includes('/edit') ? 'Editar ' :  ''
    
    const handleClickMenu: React.MouseEventHandler<HTMLImageElement> = useCallback((e) => {
        const button = e.currentTarget;
        const menu = e.currentTarget.nextElementSibling as HTMLUListElement;

        if (menu.style.display === 'none' || menu.style.display === '') {            
            button.style.transform = 'rotate(270deg)';
            menu.style.display = 'block';
            setTimeout(() => {
                button.src = imgMenu0;
            }, 400);
            setTimeout(() => {
                menu.style.height = 'calc(100vh - 90px)';
            }, 100);
        } else {
            button.style.transform = 'rotate(0deg)';
            menu.style.height = '0';
            setTimeout(() => {
                button.src = imgMenu1;
            }, 400);
            setTimeout(() => {
                menu.style.display = 'none';
            }, 1100);
        }
    }, []);

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
                window.scrollTo({
                    top: continer.offsetTop - 110,
                    behavior: 'smooth'
                });
            }, type === 'mobile' ? 1600 : 300 );
        }
    }, [selectOpt]);

    const handleclickLogo = () => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F2A819');
        document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#F2A819');
        setIsLoading(true);
        navigate('/auth/login');
    }

    const handleclickDelivery = () => {
        setIsLoading(true);
    }

    return (
        <>
        {
        !isLandingPage ? 
            <div className='header'>
                <img className='header_logo' src={logoUrl} alt={'logo ' + title} draggable='false' width='90px' />
                <h1 className='header_name'>Tío Lucho</h1>
                <h2 style={{color: titleColor || 'var(--principal)'}} className='header_title'>{prefix + title}</h2>
            </div>                    
        :
            <header>
                <div className='header_left'>
                    <img onClick={handleclickLogo} src={imgLogo} alt='Logo arepas el Tío Lucho' draggable='false' width='50px' height='50px' />
                    <div>
                        <h1>AREPAS</h1>
                        <h2>Tío Lucho</h2>
                    </div>
                </div>
                <nav className='header_center'>
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
                            <Link className='opt_web_menu' to='/delivery' onClick={handleclickDelivery}>Domicilios</Link>
                        </li>
                    </ul>
                </nav>
                <nav className='header_rigth'>
                    <img src={imgMenu1} onClick={handleClickMenu} alt='Menu Tío Lucho' draggable='false' />
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
                            <Link className='opt_mobile_menu' to='/delivery' onClick={handleclickDelivery}>Domicilios</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        }
        </>
    );
}

export { Header };