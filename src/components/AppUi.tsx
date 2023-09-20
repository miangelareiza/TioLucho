import { HashRouter, Routes, Route } from 'react-router-dom';

// Components
import { StatesProvider } from '../helpers/states';
import { AuthProvider } from '../helpers/auth';
import { ApiProvider } from '../helpers/api';
// Routes
import { LandingPage } from '../pages/LandingPage';
// import { Home } from '../pages/Home';
// import { Default } from '../pages/Default';

function AppUi() { 
    return (
        <HashRouter basename='/'>
			<StatesProvider>
				<AuthProvider>
					<ApiProvider>
						<Routes>
							<Route path='/' element={<LandingPage />} />

							{/* <Route path='/home' element={<AuthRoute> <Home /> </AuthRoute>} /> */}

							{/* <Route path='*' element={<Default />} /> */}
						</Routes>
					</ApiProvider>
				</AuthProvider>
			</StatesProvider>
        </HashRouter>
    )
};

export { AppUi };