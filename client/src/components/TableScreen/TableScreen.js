import { useEffect, useReducer, useState } from 'react';
import ENDPOINTS from '../../endpoints';
import styles from './TableScreen.module.css';

function reducer(state, action) {
	switch (action.type) {
		case 'SET_FIELD':
			return {
				...state,
				[action.field]: action.value,
			};
		case 'RESET_FIELDS':
			return {
				code: '',
				email: '',
				phone: '',
				date: '',
				status: '',
			};
		default:
			return state;
	}
}

export const TableScreen = () => {
	const [data, setData] = useState(null);
	const [editingEntry, setEditingEntry] = useState(null);
	const [state, dispatch] = useReducer(reducer, {
		code: '',
		email: '',
		phone: '',
		date: '',
		status: '',
	});

	useEffect(() => {
		fetch(ENDPOINTS.LOGIN_HISTORY)
			.then((res) => res.json())
			.then((data) => {
				setData(data);
			});
	}, []);

	const keygen = (data, i) => {
		return `${data.email}${data.phone}${data.date}${data.status}${data.code}${i}`;
	};

	const handleDelete = (entry) => {
		// Perform delete request to the server using the code
		fetch(ENDPOINTS.LOGIN_HISTORY, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...entry,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setData(data);
			});
	};

	const handleEdit = (entry) => {
		setEditingEntry(entry);
		dispatch({
			type: 'SET_FIELD',
			field: 'code',
			value: entry.code || 'No code',
		});
		dispatch({ type: 'SET_FIELD', field: 'email', value: entry.email });
		dispatch({ type: 'SET_FIELD', field: 'phone', value: entry.phone });
		dispatch({ type: 'SET_FIELD', field: 'date', value: entry.date });
		dispatch({ type: 'SET_FIELD', field: 'status', value: entry.status });
	};

	const handleConfirm = (entry, state) => {
		setEditingEntry(null);
		dispatch({ type: 'RESET_FIELDS' });
		fetch(ENDPOINTS.LOGIN_HISTORY, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				before: entry,
				after: state,
			}),
		})
			.then((res) => res.json())
			.then((data) => setData(data));
	};

	const handleCancel = (entry) => {
		setEditingEntry(null);
		dispatch({ type: 'RESET_FIELDS' });
		if (entry) {
			dispatch({
				type: 'SET_FIELD',
				field: 'date',
				value: entry.date,
			});
			dispatch({
				type: 'SET_FIELD',
				field: 'status',
				value: entry.status,
			});
		}
	};

	const handleFieldChange = (field, value) => {
		dispatch({ type: 'SET_FIELD', field, value });
	};

	return (
		<>
			{data && data.length > 0 ? (
				<div className={styles.container}>
					<h1 className={styles.title}>Login history</h1>
					<table id="dataTable" className={styles.table}>
						<thead>
							<tr>
								<th>Code</th>
								<th>Email</th>
								<th>Phone</th>
								<th>Date</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{data.map((entry, i) => (
								<tr key={keygen(entry, i)}>
									{editingEntry === entry ? (
										<>
											<td>
												<input
													type="text"
													value={state.code}
													onChange={(e) =>
														handleFieldChange(
															'code',
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type="text"
													value={state.email}
													onChange={(e) =>
														handleFieldChange(
															'email',
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type="text"
													value={state.phone}
													onChange={(e) =>
														handleFieldChange(
															'phone',
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type="text"
													value={state.date}
													onChange={(e) =>
														handleFieldChange(
															'date',
															e.target.value
														)
													}
												/>
											</td>
											<td>
												<input
													type="text"
													value={state.status}
													onChange={(e) =>
														handleFieldChange(
															'status',
															e.target.value
														)
													}
												/>
											</td>
											<td className={styles.buttonsTd}>
												<div className={styles.flexDiv}>
													<button
														onClick={() =>
															handleConfirm(
																entry,
																state
															)
														}
													>
														Confirm
													</button>
													<button
														onClick={() =>
															handleCancel(entry)
														}
													>
														Cancel
													</button>
												</div>
											</td>
										</>
									) : (
										<>
											<td>{entry.code || 'No code'}</td>
											<td>{entry.email}</td>
											<td>{entry.phone}</td>
											<td>{entry.date}</td>
											<td>{entry.status}</td>
											<td className={styles.buttonsTd}>
												<div className={styles.flexDiv}>
													<button
														onClick={() =>
															handleEdit(entry)
														}
													>
														Edit
													</button>
													<button
														onClick={() =>
															handleDelete(entry)
														}
													>
														Delete
													</button>
												</div>
											</td>
										</>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<h1 className={styles.title}>
					No recent login records to display!
				</h1>
			)}
		</>
	);
};
