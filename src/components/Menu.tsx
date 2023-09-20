import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiHome, BiTask, BiMoneyWithdraw, BiCategory, BiUser, BiLogOutCircle, BiRedo, BiCloudDownload } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
// Styles
import '../styles/Menu.css';

interface Props {
    config: {
        path?: string;
        home?: boolean;
        basic?: boolean;
        active?: boolean;
        option?: string;
    };
    role: string; // Ajusta el tipo de 'role' según tu aplicación
}

declare global {
    interface Window {
        deferredPrompt: any;
    }
}

function Menu({ config:{ path = '/', home, basic, active, option='home' }, role }: Props) {    
    const { setIsLoading } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [isReadyForInstall, setIsReadyForInstall] = useState<boolean>(false);
    
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {            
            // Prevent the mini-infobar from appearing on mobile.
            e.preventDefault();
            // Stash the event so it can be triggered later.
            window.deferredPrompt = e;
            // Remove the 'hidden' class from the install button container.
            setIsReadyForInstall(true);
        });
    }, []);
  
    async function handleClickDownloadApp() {
        const promptEvent = window.deferredPrompt;
        if (!promptEvent) {
            // The deferred prompt isn't available.
            console.log('oops, no prompt event guardado en window');
            return;
        }
        // Show the install prompt.
        promptEvent.prompt();
        // Log the result
        await promptEvent.userChoice;
        // Reset the deferred prompt variable, since
        // prompt() can only be called once.
        window.deferredPrompt = null;
        // Hide the install button.
        setIsReadyForInstall(false);
    }

    const handleClickLogOut = () => {
        auth.logout();
    }

    const handleClickBack = () => {
        setIsLoading(true);
        navigate(path ? path : '/home');
    }

    const handleClickOpt: React.MouseEventHandler<HTMLAnchorElement> = e => {
        if (!e.currentTarget.classList.contains('selected')) {
            setIsLoading(true);
            const menuOpts = document.querySelectorAll('.complete_option');
            menuOpts.forEach(element => {
                element.classList.remove('selected');
            });
            e.currentTarget.classList.add('selected');
        }
    }

    return active ? (
        <>
        {
            !basic ?
                <>
                    {
                        home ?
                            <div className='fast_menu'>
                                <button onClick={handleClickLogOut} type='button' className='fast_option' aria-label='Salir' ><BiLogOutCircle size={30} /></button>
                            </div>
                        :
                            <div className='fast_menu'>
                                <button onClick={handleClickBack} type='button' className='fast_option return' aria-label='Ir atras' ><BiRedo size={30} /></button>
                            </div>
                    }
                    <div className='complete_menu'>
                        <Link className={`complete_option ${option === 'home' ? 'selected' : ''}`} onClick={handleClickOpt}  to='/home' >
                            <BiHome size={30} />
                        </Link>
                        {/* Admin */}
                        { role === 'C55193E9-7DB1-424B-B432-CA76899D99B4' &&
                        <Link className={`complete_option ${option === 'actions' ? 'selected' : ''}`} onClick={handleClickOpt} to='/home/actions' >
                            <BiTask size={30} />
                        </Link>
                        }
                        { role === 'C55193E9-7DB1-424B-B432-CA76899D99B4' &&
                        <Link className={`complete_option ${option === 'accounting' ? 'selected' : ''}`} onClick={handleClickOpt} to='/home/accounting' >
                            <BiMoneyWithdraw size={30} />
                        </Link> 
                        }
                        { role === 'C55193E9-7DB1-424B-B432-CA76899D99B4' &&
                        <Link className={`complete_option ${option === 'settings' ? 'selected' : ''}`} onClick={handleClickOpt} to='/home/settings' >
                            <BiCategory size={30} />
                        </Link>
                        }
                        {/* Waiter */}
                        { role === 'D1141F51-D57B-4376-915D-9D45DC29078C' &&
                        <Link className={`complete_option ${option === 'actions' ? 'selected' : ''}`} onClick={handleClickOpt} to='/home/actions/takeOrder' >
                            <BiTask size={30} />
                        </Link>
                        }
                        {/* Cashier */}
                        { role === '5393DE55-0EB2-4DC7-813A-AFBEB8B995AD' &&
                        <Link className={`complete_option ${option === 'actions' ? 'selected' : ''}`} onClick={handleClickOpt} to='/home/actions/pendingOrders' >
                            <BiTask size={30} />
                        </Link>
                        }
                        <Link className={`complete_option ${option === 'profile' ? 'selected' : ''}`} onClick={handleClickOpt} to='/home/profile' >
                            <BiUser size={30} />
                        </Link>
                    </div>
                </>
            :   
                <div className='fast_menu'>
                    <button onClick={handleClickBack} type='button' className='fast_option return' aria-label='Ir atras' ><BiRedo size={30} /></button>
                    {
                        isReadyForInstall && (<button onClick={handleClickDownloadApp} type='button' className='fast_option download' aria-label='Descargar la app' ><BiCloudDownload size={30} /></button>)
                    }
                </div>
        }
        </>
    ) : null;
}

export { Menu };