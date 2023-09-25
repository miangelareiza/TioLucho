import { createContext, useContext, useEffect, useState } from 'react';

// Components
import { PageContent } from '../components/PageContent';
import { Spinner } from '../components/Spinner';
// import { ConsentModal } from '../components/ConsentModal';
// Styles 
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Toastify.css';
// Sources
import { ToastContainer, toast } from 'react-toastify';
import { v4 as newId } from 'uuid';
import { Library } from '@googlemaps/js-api-loader';
import { useJsApiLoader } from '@react-google-maps/api';
import iconSuccess from '../assets/images/toastr/Success.svg';
import iconInfo from '../assets/images/toastr/Info.svg';
import iconWarning from '../assets/images/toastr/Warning.svg';
import iconError from '../assets/images/toastr/Error.svg';

const key: string = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!;
const libraries = process.env.REACT_APP_GOOGLE_MAPS_API_LIBRARIES!.split(',') as Library[];;

type StatesContextType = {
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
	addToastr: (message: string, type?: 'success' | 'info' | 'warning' | 'error', time?: number) => void
	menuConfig: MenuConfig
	setMenuConfig: React.Dispatch<React.SetStateAction<MenuConfig>>
	isOnline: boolean
	newId: () => string
	apiMapsIsLoaded: boolean
};

const statesContext = createContext<StatesContextType | undefined>(undefined);

interface StatesProviderProps {
    children: React.ReactNode
};

interface MenuConfig {
	path?: string;
	isBasic?: boolean;
	isHome?: boolean;
	active?: boolean;
	tabOption?: 'inventory' | 'clients' | 'home' | 'transactions' | 'invoice' | 'admin';
}

function StatesProvider({ children }: StatesProviderProps) {
    const { isLoaded: apiMapsIsLoaded } = useJsApiLoader({
        googleMapsApiKey: key, 
        libraries: libraries
    });
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [menuConfig, setMenuConfig] = useState<MenuConfig>({ path:'', isBasic:false, isHome:false, active:true });
	const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
	// const [cookiesConsent, setCookiesConsent] = useState<boolean>(JSON.parse(localStorage.getItem('Allow-Cookies')!));
	// const [notificationConsent, setNotificationConsent] = useState<boolean>(JSON.parse(localStorage.getItem('Allow-Notifications')!));

	const iconGroup = {
		success: iconSuccess,
		info: iconInfo,
		warning: iconWarning,
		error: iconError,
	};

	useEffect(() => {
		const handleOnlineStatus = () => {
			setIsOnline(navigator.onLine);
		};		
		window.addEventListener('online', handleOnlineStatus);
		window.addEventListener('offline', handleOnlineStatus);	
		return () => {
			window.removeEventListener('online', handleOnlineStatus);
			window.removeEventListener('offline', handleOnlineStatus);
		};
	}, []);
	
    const addToastr = (message: string, type?: 'success' | 'info' | 'warning' | 'error', time?: number) => {
		const icon = iconGroup[type || 'success'];
		
		toast(message, {
			toastId: message,
			type: type || 'success',
			autoClose: time || 5000,
			icon: () => <img src={icon} alt={`${type} Icon`} width='27px' height='27px' />,
		});
    }

	const states: StatesContextType = { setIsLoading, addToastr, menuConfig, setMenuConfig, isOnline, newId, apiMapsIsLoaded };

	return (
		<statesContext.Provider value={states}>
			<PageContent>
				{children}
			</PageContent>

			{ isLoading ? <Spinner /> : null}

			{/* <ConsentModal consent={cookiesConsent} setConsent={setCookiesConsent} type='cookies' addToastr={addToastr} />
			<ConsentModal consent={notificationConsent} setConsent={setNotificationConsent} type='notifications' addToastr={addToastr} /> */}

			<ToastContainer
				position="bottom-right"
			/>
		</statesContext.Provider>		
	);
}

function useAppStates(): StatesContextType {
	const appStates = useContext(statesContext);
	if (!appStates) {
        throw new Error('The appStates must be used within a correct approach');
    }
	return appStates;
}

export {
	StatesProvider,
	useAppStates
};