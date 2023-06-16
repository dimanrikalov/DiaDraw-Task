import ENDPOINTS from '../endpoints';
import { useState, useEffect } from 'react';

export const useTimer = (initValue) => {
    const phone = sessionStorage.getItem('phone');
	const email = sessionStorage.getItem('email');
	const [timer, setTimer] = useState(initValue);

	const getTimeRemaining = () => {
		fetch(ENDPOINTS.GET_TIMEOUT_DURATION, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				phone,
				email,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				setTimer(data);
			});
	};

    useEffect(() => {
		getTimeRemaining();

		const interval = setInterval(() => {
			setTimer((prev) => {
				if (prev > 0) {
					return prev - 1;
				}
				return prev;
			});
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return { timer, getTimeRemaining };
};
