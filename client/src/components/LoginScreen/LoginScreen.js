import styles from './LoginScreen.module.css';
import { useReducer } from 'react';
import ENDPOINTS from '../../endpoints';
import { useNavigate } from 'react-router-dom';

import BackArrow from '../../imgs/back-arrow.png';
import PhoneImg from '../../imgs/phone.png';
import ErrorIcon from '../../imgs/input-error.png';

const EVENTS = {
	EMAIL_CHANGE: 'EMAIL_CHANGE',
	PASSWORD_CHANGE: 'PASSWORD_CHANGE',
	AGREE_CHANGE: 'AGREE_CHANGE',
	RESET: 'RESET',

	ERROR_GOOGLE: 'ERROR_GOOGLE',
	ERROR_EMAIL: 'ERROR_EMAIL',
	ERROR_PASSWORD: 'ERROR_PASSWORD',
	ERROR_RESET: 'ERROR_RESET',
	INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
};

const reducer = (state, action) => {
	switch (action.type) {
		case EVENTS.EMAIL_CHANGE:
			return {
				...state,
				email: action.value,
			};
		case EVENTS.PASSWORD_CHANGE:
			return {
				...state,
				password: action.value,
			};
		case EVENTS.AGREE_CHANGE:
			return {
				...state,
				agree: !state.agree,
			};
		case EVENTS.RESET:
			return {
				email: '',
				password: '',
				agree: false,
			};
		default:
			return state;
	}
};

const errorReducer = (state, action) => {
	switch (action.type) {
		case EVENTS.ERROR_GOOGLE:
			return {
				...state,
				googleError: 'Could not connect to Google Services!',
			};
		case EVENTS.ERROR_EMAIL:
			return {
				...state,
				emailError: 'Enter a valid email!',
			};
		case EVENTS.ERROR_PASSWORD:
			return {
				...state,
				passwordError: 'Enter a valid password!',
			};
		case EVENTS.ERROR_RESET:
			return {
				googleError: false,
				emailError: false,
				passwordError: false,
			};
		case EVENTS.INVALID_CREDENTIALS:
			return {
				googleError: 'Invalid username or password!',
			};
		default:
			return state;
	}
};

export const LoginScreen = () => {
	const navigate = useNavigate();

	const [state, dispatch] = useReducer(reducer, {
		email: '',
		password: '',
		agree: false,
	});

	const [errorsState, dispatchError] = useReducer(errorReducer, {
		googleError: false,
		emailError: false,
		passwordError: false,
	});

	const handleEmailChange = (e) => {
		dispatch({ type: EVENTS.EMAIL_CHANGE, value: e.target.value });
	};

	const handlePasswordChange = (e) => {
		dispatch({ type: EVENTS.PASSWORD_CHANGE, value: e.target.value });
	};

	const handleAgreeChange = () => {
		dispatch({ type: EVENTS.AGREE_CHANGE });
	};

	const handleGoogleError = (e) => {
		dispatchError({ type: EVENTS.ERROR_GOOGLE });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		navigate('/verify-mobile');
		// dispatchError({ type: EVENTS.ERROR_RESET });

		// if (!state.email) {
		// 	dispatchError({ type: EVENTS.ERROR_EMAIL });
		// 	return;
		// }
		// if (state.password.length < 4) {
		// 	dispatchError({ type: EVENTS.ERROR_PASSWORD });
		// 	return;
		// }
		// // Logic for form submission

		// fetch(ENDPOINTS.LOGIN, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({
		// 		...state,
		// 	}),
		// })
		// 	.then((res) => res.json())
		// 	.then((data) => {
		// 		console.log(data);

		// 		if (data.error) {
		// 			dispatchError({ type: EVENTS.ERROR_RESET });
		// 			dispatchError({ type: EVENTS.INVALID_CREDENTIALS });
		// 			return;
		// 		}
		// 		dispatch({ type: EVENTS.RESET }); //clear the fields
		// 		navigate('/verify');
		// 	});
	};

	return (
		<div className={styles.container}>
			<h3>Welcome to Website</h3>
			<div className={styles.loginDiv}>
				<div className={styles.progressBar}>
					<div className={styles.progress}></div>
				</div>
				<div className={styles.titleDiv}>
					<a href="#"><img className={styles.arrow} src={BackArrow} alt="back-arrow" /></a>
					<h5>Enter your mobile no. & email id</h5>
				</div>
				<img className={styles.phone} src={PhoneImg} alt="phone-icon" />
				<form action="#" className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.inputDiv}>
						<label htmlFor="telephone">MOBILE NO.</label>
						<input type="tel" name="telephone" id="telephone" placeholder='Enter your mobile no.'/>
						<img className={styles.errorIcon} src={ErrorIcon} alt="error-icon" />
						<div className={styles.errorDiv}>
							<p>Please enter your email id</p>
						</div>
					</div>
					<div className={styles.inputDiv}>
						<label htmlFor="email">EMAIL ADDRESS</label>
						<input type="email" name="email" id="email" placeholder='Enter your email id'/>
						<img className={styles.errorIcon} src={ErrorIcon} alt="error-icon" />
						<div className={styles.errorDiv}>
							<p>Please enter your email id</p>
						</div>
					</div>
					<button>CREATE ACCOUNT</button>
				</form>
				<p>
					By signing up, I agree to the <a href="#">Privacy Policy</a>{' '}
					& <a href="#">Terms of Use</a>
				</p>
			</div>
		</div>
	);
};
