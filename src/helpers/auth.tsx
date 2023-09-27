import React, { createContext, useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// Components
import { useAppStates } from './states';
import { Menu } from '../components/Menu';
import { getCookie, setCookie, deleteCookie } from './functions';

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
	roleId: string,
	routeId: string,
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
	active: boolean,
	remark: string
}

function AuthProvider({ children }: AuthProviderProps) {	
	const navigate = useNavigate();
	const { setIsLoading, menuConfig } = useAppStates();
	const [user, setUser] = useState<AppUser | null>(JSON.parse(getCookie('appUser')!) || null);
	const [token, setToken] = useState<string | null>(JSON.parse(getCookie('token')!) || null);
	// const path = 'https://localhost:7078/';
	const path = 'https://tiolucho.somee.com/';

	const login = (appUser: AppUser, token: string) => {		
		setUser(appUser);
		setToken(token);
		setCookie('appUser', JSON.stringify(appUser), 1);
		setCookie('token', JSON.stringify(token), 1);
		navigate('/home');
	};
	
	
	const logout = () => {
		setIsLoading(true);
		setUser(null);
		setToken(null);
		deleteCookie('appUser');
		deleteCookie('token');
		navigate('/auth/login');
	};
	
	const auth: AuthContextType = { path, user, token, login, logout };

	return (
		<AuthContext.Provider value={auth}>
			<Menu config={menuConfig} />
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

function AuthRoute({children}: AuthProviderProps): any {
	const auth = useAuth();
	if (!auth.user || !auth.token) {
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#FEFEFE');
		document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#FEFEFE');
		return <Navigate to='/auth/login' />;
	}
	return children;
}

function AdminRoute({children}: AuthProviderProps): any {
	const auth = useAuth();
	if (!auth.user || !auth.token || auth.user.roleId.toUpperCase() !== 'D1141F51-D57B-4376-915D-9D45DC29078C') {
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#FEFEFE');
		document.querySelector('meta[name="background-color"]')?.setAttribute('content', '#FEFEFE');
		return <Navigate to='/auth/login' />;
	}
	return children;
}

export {
	AuthProvider,
	AuthRoute,
	AdminRoute,
	useAuth,
};