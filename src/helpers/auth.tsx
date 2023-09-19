import { createContext, useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from './states';
// import { Menu } from '../components/Menu';

type AuthContextType = {
	path: string
	user: AppUser | null
	token: string | null
	login: (appUser: AppUser, token: string) => void
	logout: () => void
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode
};

interface AppUser {	
	id: string,
	restaurantId: string,
	roleId: string,
	imageUrl?: string,
	name: string,
	user: string,
	document: string,
	email: string,
	biEmailConfirm: boolean,
	phone: string,
	biPhoneConfirm: boolean,
	birthDay: string,
	gender: string,
	remark: string
}

function AuthProvider({ children }: AuthProviderProps) {	
	const navigate = useNavigate();
	const { setIsLoading } = useAppStates();
	const [user, setUser] = useState<AppUser | null>(JSON.parse(sessionStorage.getItem('appUser')!) || null);
	const [token, setToken] = useState<string | null>(JSON.parse(sessionStorage.getItem('token')!) || null);
	// const path = 'https://localhost:7027/';
	const path = 'https://tiolucho.somee.com/';

	const login = (appUser: AppUser, token: string) => {		
		setUser(appUser);
		setToken(token);
		sessionStorage.setItem('appUser', JSON.stringify(appUser));
		sessionStorage.setItem('token', JSON.stringify(token));
		navigate('/home');
	};
	
	const logout = () => {
		setIsLoading(true);
		setUser(null);
		setToken(null);
		sessionStorage.removeItem('appUser');
		sessionStorage.removeItem('token');
		navigate('/auth/login');
	};
	
	const auth: AuthContextType = { path, user, token, login, logout };

	return (
		<AuthContext.Provider value={auth}>
			{/* <Menu config={menuConfig} role={auth.user ? auth.user.roleId.toUpperCase() : ''} /> */}
			{children}
		</AuthContext.Provider>		
	);
}

function useAuth(): AuthContextType {
	const auth = useContext(AuthContext);
	if (!auth) {
        throw new Error('The auth must be used within a correct approach');
    }
	return auth;
}

function AuthRoute({children}: AuthProviderProps) {
	const auth = useAuth();
	if (!auth.user || !auth.token) {
		return <Navigate to='/auth/login' />;
	}
	return children;
}

export {
	AuthProvider,
	AuthRoute,
	useAuth,
};