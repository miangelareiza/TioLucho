import { HashRouter, Routes as RoutesContainer, Route } from 'react-router-dom';

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
import { NewSaleReader } from '../pages/NewSaleReader';
import { NewSale } from '../pages/NewSale';

import { Admin } from '../pages/Admin';
import { Clients } from '../pages/Admin/Clients';
import { ClientsForm } from '../pages/Admin/ClientsForm';
import { Categories } from '../pages/Admin/Categories';
import { CategoriesForm } from '../pages/Admin/CategoriesForm';
import { Products } from '../pages/Admin/Products';
import { ProductsForm } from '../pages/Admin/ProductsForm';
import { Routes } from '../pages/Admin/Routes';
import { RoutesForm } from '../pages/Admin/RoutesForm';
import { Users } from '../pages/Admin/Users';
import { UsersForm } from '../pages/Admin/UsersForm';
import { Inventories } from '../pages/Admin/Inventories';
import { InventoriesForm } from '../pages/Admin/InventoriesForm';

import { Transactions } from '../pages/Transactions';
import { IncomeAndExpense } from '../pages/IncomeAndExpense';

import { Default } from '../pages/Default';

function AppUi() { 
    return (
        <HashRouter basename='/'>
			<StatesProvider>
				<AuthProvider>
					<ApiProvider>
						<RoutesContainer>
							<Route path='/' element={<LandingPage />} />

							<Route path='/auth/login' element={<Login />} />
							<Route path='/auth/recovery' element={<Recovery />} />
							<Route path='/auth/confirmEmail/:id' element={<ConfirmEmail />} />

							<Route path='/home' element={<AuthRoute> <Home /> </AuthRoute>} />
							
							<Route path='/home/newSale' element={<AuthRoute> <NewSaleReader /> </AuthRoute>} />
							<Route path='/home/newSale/:clientId' element={<AdminRoute> <NewSale /> </AdminRoute>} />

							<Route path='/home/transactions' element={<AuthRoute> <Transactions /> </AuthRoute>} >
								<Route path='income' element={<AuthRoute> <IncomeAndExpense /> </AuthRoute>} />
								<Route path='expense' element={<AuthRoute> <IncomeAndExpense /> </AuthRoute>} />
							</Route>

							<Route path='/home/admin' element={<AdminRoute> <Admin /> </AdminRoute>} />
							<Route path='/home/admin/clients' element={<AdminRoute> <Clients /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <ClientsForm /> </AdminRoute>} />
								<Route path='edit/:id' element={<AdminRoute> <ClientsForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/categories' element={<AdminRoute> <Categories /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <CategoriesForm /> </AdminRoute>} />
								<Route path='edit/:id' element={<AdminRoute> <CategoriesForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/products' element={<AdminRoute> <Products /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <ProductsForm /> </AdminRoute>} />
								<Route path='edit/:id' element={<AdminRoute> <ProductsForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/routes' element={<AdminRoute> <Routes /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <RoutesForm /> </AdminRoute>} />
								<Route path='edit/:id' element={<AdminRoute> <RoutesForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/users' element={<AdminRoute> <Users /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <UsersForm /> </AdminRoute>} />
								<Route path='edit/:id' element={<AdminRoute> <UsersForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/inventories' element={<AdminRoute> <Inventories /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <InventoriesForm /> </AdminRoute>} />
								<Route path='resupply' element={<AdminRoute> <InventoriesForm /> </AdminRoute>} />
							</Route>

							<Route path='*' element={<Default />} />
						</RoutesContainer>
					</ApiProvider>
				</AuthProvider>
			</StatesProvider>
        </HashRouter>
    )
};

export { AppUi };