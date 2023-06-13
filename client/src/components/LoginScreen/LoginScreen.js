import styles from './LoginScreen.module.css';
import { useEffect, useReducer, useState } from 'react';
import ENDPOINTS from '../../endpoints';
import { useNavigate, useSearchParams } from 'react-router-dom';

import BackArrow from '../../imgs/back-arrow.png';
import PhoneImg from '../../imgs/phone.png';
import ErrorIcon from '../../imgs/input-error.png';

const EVENTS = {
	EMAIL_CHANGE: 'EMAIL_CHANGE',
	PHONE_CHANGE: 'PHONE_CHANGE',
	RESET: 'RESET',

	ERROR_PHONE: 'ERROR_PHONE',
	ERROR_EMAIL: 'ERROR_EMAIL',
	ERROR_CREDENTIALS: 'ERROR_CREDENTIALS',
	ERROR_RESET: 'ERROR_RESET',
};

const reducer = (state, action) => {
	switch (action.type) {
		case EVENTS.EMAIL_CHANGE:
			return {
				...state,
				email: action.value,
			};
		case EVENTS.PHONE_CHANGE:
			return {
				...state,
				phone: action.value,
			};
		case EVENTS.RESET:
			return {
				email: '',
				phone: '',
			};
		default:
			return state;
	}
};

const errorReducer = (state, action) => {
	switch (action.type) {
		case EVENTS.ERROR_PHONE:
			return {
				...state,
				phoneError: action.errorMessage,
			};
		case EVENTS.ERROR_EMAIL:
			return {
				...state,
				emailError: action.errorMessage,
			};
		case EVENTS.ERROR_CREDENTIALS:
			return {
				...state,
				loginError: action.errorMessage,
			};
		case EVENTS.ERROR_RESET:
			return {
				emailError: false,
				phoneError: false,
				loginError: false,
			};
		default:
			return state;
	}
};

export const LoginScreen = () => {
	const navigate = useNavigate();

	const [style, setStyle] = useState({});

	const [state, dispatch] = useReducer(reducer, {
		email: '',
		phone: '',
	});

	const [errorsState, dispatchError] = useReducer(errorReducer, {
		emailError: false,
		phoneError: false,
		loginError: false,
	});

	useEffect(() => {
		const timeout = setTimeout(() => {
			setStyle({width: '35%'});
		}, 100);

		return () => {
			clearTimeout(timeout);
		}
	}, []);


	const handleEmailChange = (e) => {
		dispatch({ type: EVENTS.EMAIL_CHANGE, value: e.target.value });
	};

	const handlePhoneChange = (e) => {
		dispatch({ type: EVENTS.PHONE_CHANGE, value: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatchError({ type: EVENTS.ERROR_RESET });

		if (state.phone.length !== 10) {
			dispatchError({
				type: EVENTS.ERROR_PHONE,
				errorMessage: 'A valid phone number is required!',
			});
			return;
		}

		if (!state.email) {
			dispatchError({
				type: EVENTS.ERROR_EMAIL,
				errorMessage: 'A valid e-mail address is required!',
			});
			return;
		}

		fetch(ENDPOINTS.LOGIN, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				...state,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);

				if (data.error) {
					dispatchError({ type: EVENTS.ERROR_RESET });
					dispatchError({
						type: EVENTS.ERROR_CREDENTIALS,
						errorMessage: data.error,
					});
					return;
				}
				dispatch({ type: EVENTS.RESET }); //clear the fields
				sessionStorage.setItem('email', state.email);
				sessionStorage.setItem('phone', state.phone);
				navigate('/verify-mobile');
			});
	};

	return (
		<div className={styles.container}>
			<h3>Welcome to Website</h3>
			<div className={styles.loginDiv}>
				<div className={styles.progressBar}>
					<div className={styles.progress} style={style}></div>
				</div>
				<div className={styles.titleDiv}>
					<button className={styles.arrow} onClick={() => navigate(-1)}>
						<img
							src={BackArrow}
							alt="back-arrow"
						/>
					</button>
					<h5>Enter your mobile no. & email id</h5>
				</div>
				<img className={styles.phone} src={PhoneImg} alt="phone-icon" />
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.inputDiv}>
						<label htmlFor="phone">MOBILE NO.</label>
						<input
							type="tel"
							name="phone"
							id="phone"
							placeholder="Enter your mobile no."
							value={state.phone}
							onChange={handlePhoneChange}
						/>
						{errorsState.phoneError && (
							<img
								className={styles.errorIcon}
								src={ErrorIcon}
								alt="error-icon"
							/>
						)}
						{errorsState.phoneError && (
							<div className={styles.errorDiv}>
								<p>{errorsState.phoneError}</p>
							</div>
						)}
					</div>
					<div className={styles.inputDiv}>
						<label htmlFor="email">EMAIL ADDRESS</label>
						<input
							type="email"
							name="email"
							id="email"
							placeholder="Enter your email id"
							value={state.email}
							onChange={handleEmailChange}
						/>
						{errorsState.emailError && (
							<img
								className={styles.errorIcon}
								src={ErrorIcon}
								alt="error-icon"
							/>
						)}
						{errorsState.emailError && (
							<div className={styles.errorDiv}>
								<p>{errorsState.emailError}</p>
							</div>
						)}
					</div>
					{errorsState.loginError && (
						<div className={styles.errorDiv}>
							<p>{errorsState.loginError}</p>
						</div>
					)}
					<button>CREATE ACCOUNT</button>
				</form>
				<p>
					By signing up, I agree to the <button>Privacy Policy</button>{' '}
					& <button>Terms of Use</button>
				</p>
			</div>
		</div>
	);
};
