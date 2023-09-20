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
    role: string;
}

declare global {
    interface Window {
        deferredPrompt: any;
    }
}

function Menu({ config:{ path = '/', home, basic, active = true, option='home' }, role }: Props) {    
    const { setIsLoading } = useAppStates();
    const auth = useAuth();
    const navigate = useNavigate();
    const [isReadyForInstall, setIsReadyForInstall] = useState<boolean>(false);
    
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {            
            e.preventDefault();
            window.deferredPrompt = e;
            setIsReadyForInstall(true);
        });
    }, []);
  
    const handleClickDownloadApp = async () => {
        const promptEvent = window.deferredPrompt;
        
        if (!promptEvent) {
            console.log('oops, no prompt event guardado en window');
            return;
        }
        
        const userChoice = await promptEvent.prompt();

        if (userChoice.outcome === 'accepted') {
            window.deferredPrompt = null;
            setIsReadyForInstall(false);
        }
    }

    const handleClickLogOut = () => {
        auth.logout();
    }

    const handleClickBack = () => {
        setIsLoading(true);
        navigate(path || '/home');
    }

    const handleClickOpt: React.MouseEventHandler<HTMLAnchorElement> = e => {
        if (!e.currentTarget.classList.contains('selected')) {
            setIsLoading(true);

            document.querySelectorAll('.complete_option').forEach(element => {
                element.classList.remove('selected');
            });

            e.currentTarget.classList.add('selected');
        }
    }

    return active ? (
        <>{
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
                    { isReadyForInstall && <button onClick={handleClickDownloadApp} type='button' className='fast_option download' aria-label='Descargar la app' ><BiCloudDownload size={30} /></button> }
                </div>
        }</>
    ) : null;
}

export { Menu };