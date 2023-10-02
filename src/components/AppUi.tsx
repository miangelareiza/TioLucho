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
import { MyInventory } from '../pages/MyInventory';
import { MyClients } from '../pages/MyClients';
import { NewSaleReader } from '../pages/NewSaleReader';
import { NewSale } from '../pages/NewSale';

import { Admin } from '../pages/Admin';
import { ClientsAdmin } from '../pages/Admin/ClientsAdmin';
import { ClientsForm } from '../pages/Admin/ClientsForm';
import { CategoriesAdmin } from '../pages/Admin/CategoriesAdmin';
import { CategoriesForm } from '../pages/Admin/CategoriesForm';
import { ProductsAdmin } from '../pages/Admin/ProductsAdmin';
import { ProductsForm } from '../pages/Admin/ProductsForm';
import { RoutesAdmin } from '../pages/Admin/RoutesAdmin';
import { RoutesForm } from '../pages/Admin/RoutesForm';
import { UsersAdmin } from '../pages/Admin/UsersAdmin';
import { UsersForm } from '../pages/Admin/UsersForm';
import { InventoriesAdmin } from '../pages/Admin/InventoriesAdmin';
import { InventoriesForm } from '../pages/Admin/InventoriesForm';
import { SalesAdmin } from '../pages/Admin/SalesAdmin';
import { NotSalesAdmin } from '../pages/Admin/NotSalesAdmin';
import { TransactionsAdmin } from '../pages/Admin/TransactionsAdmin';
// import { LiquidationsAdmin } from '../pages/Admin/LiquidationsAdmin';

import { MyTransactions } from '../pages/MyTransactions';
import { MyTransactionsForm } from '../pages/MyTransactionsForm';

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
							<Route path='/home/myInventory' element={<AuthRoute> <MyInventory /> </AuthRoute>} />
							<Route path='/home/myClients' element={<AuthRoute> <MyClients /> </AuthRoute>} />
							<Route path='/home/myTransactions' element={<AuthRoute> <MyTransactions /> </AuthRoute>} >
								<Route path='income' element={<AuthRoute> <MyTransactionsForm /> </AuthRoute>} />
								<Route path='expense' element={<AuthRoute> <MyTransactionsForm /> </AuthRoute>} />
							</Route>
							<Route path='/home/newSale' element={<AuthRoute> <NewSaleReader /> </AuthRoute>} />
							<Route path='/home/newSale/:clientId' element={<AuthRoute> <NewSale /> </AuthRoute>} />

							<Route path='/home/admin' element={<AdminRoute> <Admin /> </AdminRoute>} />
							<Route path='/home/admin/routes' element={<AdminRoute> <RoutesAdmin /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <RoutesForm /> </AdminRoute>} />
								<Route path='edit/:id' element={<AdminRoute> <RoutesForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/categories' element={<AdminRoute> <CategoriesAdmin /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <CategoriesForm /> </AdminRoute>} />
								<Route path='edit/:id' element={<AdminRoute> <CategoriesForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/products' element={<AdminRoute> <ProductsAdmin /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <ProductsForm /> </AdminRoute>} />
								<Route path='edit/:id' element={<AdminRoute> <ProductsForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/clients' element={<AdminRoute> <ClientsAdmin /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <ClientsForm /> </AdminRoute>} />
								<Route path='edit/:id' element={<AdminRoute> <ClientsForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/users' element={<AdminRoute> <UsersAdmin /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <UsersForm /> </AdminRoute>} />
								<Route path='edit/:id' element={<AdminRoute> <UsersForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/inventories' element={<AdminRoute> <InventoriesAdmin /> </AdminRoute>} >
								<Route path='new' element={<AdminRoute> <InventoriesForm /> </AdminRoute>} />
								<Route path='resupply' element={<AdminRoute> <InventoriesForm /> </AdminRoute>} />
							</Route>
							<Route path='/home/admin/sales' element={<AdminRoute> <SalesAdmin /> </AdminRoute>} />
							<Route path='/home/admin/notSales' element={<AdminRoute> <NotSalesAdmin /> </AdminRoute>} />
							<Route path='/home/admin/transactions' element={<AdminRoute> <TransactionsAdmin /> </AdminRoute>} />
							{/* <Route path='/home/admin/liquidations' element={<AdminRoute> <LiquidationsAdmin /> </AdminRoute>} /> */}

							<Route path='*' element={<Default />} />
						</RoutesContainer>
					</ApiProvider>
				</AuthProvider>
			</StatesProvider>
        </HashRouter>
    )
};

export { AppUi };