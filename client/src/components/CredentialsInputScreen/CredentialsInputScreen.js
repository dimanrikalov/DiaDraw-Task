import { useReducer } from 'react';
import ENDPOINTS from '../../endpoints';
import PhoneImg from '../../imgs/phone.png';
import { useLocation, useNavigate } from 'react-router-dom';
import BackArrow from '../../imgs/back-arrow.png';
import ErrorIcon from '../../imgs/input-error.png';
import styles from './CredentialsInputScreen.module.css';
import { useErrorReducer } from '../../hooks/useErrorReducer';
import { useLoadingEffect } from '../../hooks/useLoadingEffect';

const EVENTS = {
	RESET: 'RESET',
	EMAIL_CHANGE: 'EMAIL_CHANGE',
	PHONE_CHANGE: 'PHONE_CHANGE',
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

export const CredentialsInputScreen = () => {
	const location = useLocation();
	const operation = location.pathname.split('/')[2];

	const navigate = useNavigate();
	const [state, dispatch] = useReducer(reducer, {
		email: '',
		phone: '',
	});
	const { style } = useLoadingEffect('35%');
	const { errorsState, dispatchError, errorEvents } = useErrorReducer();

	const handleInputChange = (e, eventType) => {
		dispatch({ type: eventType, value: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatchError({ type: errorEvents.ERROR_RESET });

		if (state.phone.length !== 10) {
			dispatchError({
				type: errorEvents.ERROR_PHONE,
			});
			return;
		}

		if (!state.email) {
			dispatchError({
				type: errorEvents.ERROR_EMAIL,
			});
			return;
		}

		if (operation === 'login') {
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
						dispatchError({ type: errorEvents.ERROR_RESET });
						dispatchError({
							type: errorEvents.ERROR_RESPONSE,
							errorMessage: data.error,
						});
						return;
					}
					dispatch({ type: EVENTS.RESET }); //clear the fields
					sessionStorage.setItem('email', state.email); //adding them for the next step
					sessionStorage.setItem('phone', state.phone);
					navigate('/auth/verify-mobile');
				});
		} else if (operation === 'register') {
			fetch(ENDPOINTS.REGISTER, {
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
					if (data.error) {
						dispatchError({ type: errorEvents.ERROR_RESET });
						dispatchError({
							type: errorEvents.ERROR_RESPONSE,
							errorMessage: data.error,
						});
						return;
					}
					
					console.log(data.code);
					
					dispatch({ type: EVENTS.RESET }); //clear the fields
					sessionStorage.setItem('email', state.email); //saving them for the next step
					sessionStorage.setItem('phone', state.phone);
					navigate('/auth/verify-mobile');
				});
		}
	};

	return (
		<div className={styles.container}>
			<h3>Welcome to Website</h3>
			<div className={styles.loginDiv}>
				<div className={styles.progressBar}>
					<div className={styles.progress} style={style}></div>
				</div>
				<div className={styles.titleDiv}>
					<button
						className={styles.arrow}
						onClick={() => navigate(-1)}
					>
						<img src={BackArrow} alt="back-arrow" />
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
							onChange={(e) =>
								handleInputChange(e, EVENTS.PHONE_CHANGE)
							}
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
							onChange={(e) =>
								handleInputChange(e, EVENTS.EMAIL_CHANGE)
							}
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
					By signing up, I agree to the{' '}
					<button>Privacy Policy</button> &{' '}
					<button>Terms of Use</button>
				</p>
			</div>
		</div>
	);
};
