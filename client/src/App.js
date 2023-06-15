import styles from './App.module.css';
import { HomeScreen } from './components/HomeScreen/HomeScreen';
import { TableScreen } from './components/TableScreen/TableScreen';
import { VerifyAccount } from './components/VerifyAccount/VerifyAccount';
import { ConfirmationScreen } from './components/ConfirmationScreen/ConfirmationScreen';
import { CredentialsInputScreen } from './components/CredentialsInputScreen/CredentialsInputScreen';

import {
	Route,
	Outlet,
	Navigate,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom';

const RequireAuth = () => {
	const isAuthenticated = !!localStorage.getItem('id');
	return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const RequireNotAuth = () => {
	const isAuthenticated = !!localStorage.getItem('id');
	return isAuthenticated ? <Navigate to="/auth/confirm" /> : <Outlet />;
};

const RequireCredentialsInSessionStorage = () => {
	const isAuthenticated = localStorage.getItem('id');
	const isVerifying = sessionStorage.getItem('phone') && sessionStorage.getItem('email');
	if (isAuthenticated) {
		return <Navigate to="/auth/confirm" />;
	} else if (isVerifying) {
		return <Outlet />;
	}
	return <Navigate to="/" />;
};

const Root = () => {
	return (
		<>
			<Outlet />
		</>
	);
};

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<Root />}>
				<Route element={<RequireNotAuth />}>
					<Route index element={<HomeScreen />} />
					<Route
						path="/auth/login"
						element={<CredentialsInputScreen />}
					/>
					<Route
						path="/auth/register"
						element={<CredentialsInputScreen />}
					/>
					<Route element={<RequireCredentialsInSessionStorage />}>
						<Route
							path="/auth/verify-mobile"
							element={<VerifyAccount toVerify={'mobile'} />}
						/>
						<Route
							path="/auth/verify-email"
							element={<VerifyAccount toVerify={'email'} />}
						/>
					</Route>
				</Route>
				<Route element={<RequireAuth />}>
					<Route
						path="/auth/confirm"
						element={<ConfirmationScreen />}
					/>
					<Route path="/login-entries" element={<TableScreen />} />
				</Route>
				<Route path="*" element={<Navigate to={'/'} />} />
			</Route>
		)
	);

	return (
		<div className={styles.App}>
			<header className={styles.header}>
				<p className={styles.title}>Website</p>
				<button>NEED HELP?</button>
			</header>
			<main>
				<RouterProvider router={router} />
			</main>
		</div>
	);
}

export default App;
