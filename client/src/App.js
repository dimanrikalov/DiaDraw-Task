import styles from './App.module.css';
import { LoginScreen } from './components/LoginScreen/LoginScreen';
import { VerifyAccount } from './components/VerifyAccount/VerifyAccount';
import { UserScreen } from './components/UserScreen/UserScreen';
import { TableScreen } from './components/TableScreen/TableScreen';

import {
	createBrowserRouter,
	createRoutesFromElements,
	Outlet,
	Route,
	RouterProvider,
} from 'react-router-dom';
import { HomeScreen } from './components/HomeScreen/HomeScreen';

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<Root />}>
				<Route index element={<HomeScreen />} />
				<Route path="/login" element={<LoginScreen />} />
				<Route path="/register" element={<LoginScreen />} />
				<Route path="/verify" element={<VerifyAccount />} />		{/* add route guard */}
				<Route path="/user" element={<UserScreen />} /> 			{/* add route guard */}
				<Route path="/login-entries" element={<TableScreen />} /> 	{/* add route guard */}
			</Route>
		)
	);

	return (
		<div className={styles.App}>
			<div className={styles['inner-wrapper']}>
				<RouterProvider router={router} />
			</div>
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
