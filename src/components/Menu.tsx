import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiLogOutCircle, BiRedo, BiCloudDownload } from 'react-icons/bi';

// Components
import { useAppStates } from '../helpers/states';
import { useAuth } from '../helpers/auth';
import { TabBar } from './TabBar';
// Styles
import '../styles/Menu.css';

interface Props {
    config: {
        path?: string;
        isBasic?: boolean;
        isHome?: boolean;
        active?: boolean;
        tabOption?: 'inventory' | 'clients' | 'home' | 'transactions' | 'invoice' | 'admin';
    }
}

declare global {
    interface Window {
        deferredPrompt: any;
    }
}

function Menu({ config:{ path = '/home', isBasic, isHome, active = true, tabOption } }: Props) {    
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

    return active ? (
        <>{
            !isBasic && tabOption ?
                <>
                    {
                        isHome ?
                            <div className='fast_menu home'>
                                <button onClick={handleClickLogOut} type='button' className='fast_option' aria-label='Salir' ><BiLogOutCircle size={30} /></button>
                            </div>
                        :
                            <div className='fast_menu home'>
                                <button onClick={handleClickBack} type='button' className='fast_option return' aria-label='Ir atras' ><BiRedo size={30} /></button>
                            </div>
                    }
                    <TabBar tabOption={tabOption} />
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