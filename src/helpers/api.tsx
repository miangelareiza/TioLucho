import { createContext, useContext } from 'react';

// Components
import { useAppStates } from './states';
import { useAuth } from './auth';
// Sources
import axios, { AxiosInstance } from 'axios';

type ApiContextType = {
    getApiData: (endPoint: string, isAuth: boolean) => Promise<any>;
    postApiData: (path: string, body: {} | FormData, isAuth: boolean, type: string) => Promise<any>;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

class ApiWarning extends Error {
    type: string;
    constructor(message: string) {
        super(message);
        this.name = 'ApiWarning';
        this.type = 'warning';
    }
}

class ApiError extends Error {
    type: string;
    constructor(message: string) {
        super(message);
        this.name = 'ApiError';
        this.type = 'error';
    }
}

class ApiInfo extends Error {
    type: string;
    constructor(message: string) {
        super(message);
        this.name = 'ApiInfo';
        this.type = 'info';
    }
}

interface ApiProviderProps {
    children: React.ReactNode
};

function ApiProvider({ children }: ApiProviderProps) {	
    const { path, token, logout } = useAuth();
    const { setIsLoading, isOnline } = useAppStates();
    const api: AxiosInstance = axios.create({
        baseURL: `${path}api/`,
        withCredentials: false
    });

    const handleApiResponse = (response: any) => {
        if (response.data.cod === '-1') {
            throw new ApiWarning(response.data.rpta);
        }
        setIsLoading(false);
        return response.data;
    };

    const handleApiError = (error: any) => {
        if (error.response && error.response.status === 401) {
            logout();
            throw new ApiInfo('¡Tu sesion ha expirado! Por favor ingresa de nuevo.');
        }
        setIsLoading(false);

        if (error.name === 'ApiWarning') throw error;        
        if (error.name === 'ApiInfo') throw error;

        throw new ApiError('¡Ha ocurrido un error! Por favor, inténtalo de nuevo o contacta a tu administrador.');
    };
    
    const getApiData = async (endPoint: string, isAuth: boolean) => {
        if (!isOnline) {
            throw new ApiInfo('Revisa tu conexion a internet.');
        }
        
        setIsLoading(true);
        const config = isAuth ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
        try {
            const response = await api.get(endPoint, config);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    };
    
    const postApiData = async (path: string, body: {} | FormData, isAuth: boolean, type: string) => {
        if (!isOnline) {
            throw new ApiInfo('Revisa tu conexion a internet.');
        }
        
        setIsLoading(true);
        const config = isAuth ? 
            { headers:{ Authorization: `Bearer ${token}`, 'Content-Type': type } } 
        : 
            { headers:{ 'Content-Type': type } };

        try {
            const response = await api.post(path, body, config);
            return handleApiResponse(response);
        } catch (error) {
            return handleApiError(error);
        }
    };

	const apiData: ApiContextType = { getApiData, postApiData };

	return (
		<ApiContext.Provider value={apiData}>
			{children}
		</ApiContext.Provider>		
	);
}

function useApi(): ApiContextType {
	const api = useContext(ApiContext);
	if (!api) {
        throw new Error('The api must be used within a correct approach');
    }
    return api;
}

export {
	ApiProvider,
	useApi
};