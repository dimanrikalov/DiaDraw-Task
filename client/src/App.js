import styles from './App.module.css';
import { HomeScreen } from './components/HomeScreen/HomeScreen';
import { LoginScreen } from './components/LoginScreen/LoginScreen';
import { VerifyAccount } from './components/VerifyAccount/VerifyAccount';
import { UserScreen } from './components/UserScreen/UserScreen';
import { TableScreen } from './components/TableScreen/TableScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen/ConfirmationScreen';

import {
	createBrowserRouter,
	createRoutesFromElements,
	Outlet,
	Route,
	RouterProvider,
} from 'react-router-dom';


function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<Root />}>
				<Route index element={<HomeScreen />} />
				<Route path="/login" element={<LoginScreen />} />
				<Route path="/register" element={<LoginScreen />} />
				<Route
					path="/verify-mobile"
					element={<VerifyAccount toVerify={'mobile'} />}
				/>{' '}
				<Route
					path="/verify-email"
					element={<VerifyAccount toVerify={'email'} />}
				/>{' '}
				<Route path="/confirm-mobile" element={<ConfirmationScreen toVerify={'mobile'} />} />{' '}
				<Route path="/confirm-email" element={<ConfirmationScreen toVerify={'email'} />} />{' '}
				{/* add route guard */}
				<Route path="/user" element={<UserScreen />} />{' '}
				{/* add route guard */}
				<Route path="/login-entries" element={<TableScreen />} />{' '}
				{/* add route guard */}
			</Route>
		)
	);

	return (
		<div className={styles.App}>
			<header className={styles.header}>
				<p className={styles.title}>Website</p>
				<a href="#">NEED HELP?</a>
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
