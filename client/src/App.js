import styles from './App.module.css';
import { HomeScreen } from './components/HomeScreen/HomeScreen';
import { CredentialsInputScreen } from './components/CredentialsInputScreen/CredentialsInputScreen';
import { VerifyAccount } from './components/VerifyAccount/VerifyAccount';
import { TableScreen } from './components/TableScreen/TableScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen/ConfirmationScreen';

import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Outlet,
	Route,
	RouterProvider,
} from 'react-router-dom';

const RequireAuth = () => {
	const isAuthenticated = !!localStorage.getItem('id');
	return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<Root />}>
				<Route index element={<HomeScreen />} />
				<Route path="/auth/login" element={<CredentialsInputScreen />} />
				<Route path="/auth/register" element={<CredentialsInputScreen />} />
				<Route
					path="/auth/verify-mobile"
					element={<VerifyAccount toVerify={'mobile'} />}
				/>
				<Route
					path="/auth/verify-email"
					element={<VerifyAccount toVerify={'email'} />}
				/>
				<Route element={<RequireAuth />}>
					<Route
						path="/auth/confirm"
						element={<ConfirmationScreen />}
					/>
					<Route path="/login-entries" element={<TableScreen />} />
				</Route>
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

const Root = () => {
	return (
		<>
			<Outlet />
		</>
	);
};

export default App;
