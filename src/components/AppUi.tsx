import { HashRouter, Routes, Route } from 'react-router-dom';

// Components
import { StatesProvider } from '../helpers/states';
import { AuthProvider, AuthRoute, AdminRoute } from '../helpers/auth';
import { ApiProvider } from '../helpers/api';

// Routes
import { LandingPage } from '../pages/LandingPage';

import { Login } from '../pages/Login';
import { Recovery } from '../pages/Recovery';
import { ConfirmEmail } from '../pages/ConfirmEmail';

import { Home } from '../pages/Home';

import { Admin } from '../pages/Admin';
import { Clients } from '../pages/Admin/Clients';

import { Transactions } from '../pages/Transactions';
import { IncomeAndExpense } from '../pages/IncomeAndExpense';

import { Default } from '../pages/Default';

function AppUi() { 
    return (
        <HashRouter basename='/'>
			<StatesProvider>
				<AuthProvider>
					<ApiProvider>
						<Routes>
							<Route path='/' element={<LandingPage />} />

							<Route path='/auth/login' element={<Login />} />
							<Route path='/auth/recovery' element={<Recovery />} />
							<Route path='/auth/confirmEmail/:id' element={<ConfirmEmail />} />

							<Route path='/home' element={<AuthRoute> <Home /> </AuthRoute>} />
							
							<Route path='/home/transactions' element={<AuthRoute> <Transactions /> </AuthRoute>} >
								<Route path='income' element={<AuthRoute> <IncomeAndExpense /> </AuthRoute>} />
								<Route path='expense' element={<AuthRoute> <IncomeAndExpense /> </AuthRoute>} />
							</Route>

							<Route path='/home/admin' element={<AdminRoute> <Admin /> </AdminRoute>} />
							<Route path='/home/admin/clients' element={<AdminRoute> <Clients /> </AdminRoute>} />

							<Route path='*' element={<Default />} />
						</Routes>
					</ApiProvider>
				</AuthProvider>
			</StatesProvider>
        </HashRouter>
    )
};

export { AppUi };