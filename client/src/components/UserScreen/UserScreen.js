import { useState, useEffect } from 'react';
import ENDPOINTS from '../../endpoints';

export const UserScreen = () => {
	const [user, setUser] = useState(null);
	const id = localStorage.getItem('id');

	useEffect(() => {
		fetch(ENDPOINTS.GET_USER_DATA(id))
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					setUser(data[id]);
				}
			});
	}, []);

	return (
		<div>
			<h1>Username: {user?.email}</h1>
			<h1>Password: {user?.password}</h1>
			{user?.agree ? (
				<h1>User agreed to join Figma's newsletter</h1>
			) : (
				<h1>User did not agree to join Figma's newsletter</h1>
			)}
		</div>
	);
};
