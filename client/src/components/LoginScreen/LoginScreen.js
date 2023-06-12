import styles from './LoginScreen.module.css';
import { useReducer } from 'react';
import ENDPOINTS from '../../endpoints';
import { useNavigate } from 'react-router-dom';

const EVENTS = {
	EMAIL_CHANGE: 'EMAIL_CHANGE',
	PASSWORD_CHANGE: 'PASSWORD_CHANGE',
	AGREE_CHANGE: 'AGREE_CHANGE',
	RESET: 'RESET',

	ERROR_GOOGLE: 'ERROR_GOOGLE',
	ERROR_EMAIL: 'ERROR_EMAIL',
	ERROR_PASSWORD: 'ERROR_PASSWORD',
	ERROR_RESET: 'ERROR_RESET',
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
				agree: false
			}
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
		dispatchError({ type: EVENTS.ERROR_RESET });

		if (!state.email) {
			dispatchError({ type: EVENTS.ERROR_EMAIL });
			return;
		}
		if (state.password.length < 4) {
			dispatchError({ type: EVENTS.ERROR_PASSWORD });
			return;
		}
		// Logic for form submission

		fetch(ENDPOINTS.LOGIN, {
			method: 'POST',
			headers: {
                'Content-Type': 'application/json',
            },
			body: JSON.stringify({
				...state
			})
		})
		.then(res => res.json())
		.then(data => {
			dispatch({type: EVENTS.RESET}); //clear the fields
			navigate('/verify');
		});
	};

	return (
		<div className={styles.container}>
			<h1>Want to check out this file? Log in or sign up</h1>
			<form onSubmit={handleSubmit} className={styles['form-container']}>
				<div className={styles.error}>
					{errorsState.googleError && (
						<p>{errorsState.googleError}</p>
					)}
				</div>
				<input
					type="button"
					value="Continue with Google"
					className={styles["google-login"]}
					onClick={handleGoogleError}
				/>
				<p>or</p>
				<input
					type="email"
					placeholder="Email"
					className={styles["data-input"]}
					value={state.email}
					onChange={handleEmailChange}
				/>
				<div className={styles.error}>
					{errorsState.emailError && <p>{errorsState.emailError}</p>}
				</div>
				<input
					type="password"
					placeholder="Password"
					className={styles["data-input"]}
					value={state.password}
					onChange={handlePasswordChange}
				/>
				<div className={styles.error}>
					{errorsState.passwordError && (
						<p>{errorsState.passwordError}</p>
					)}
				</div>
				<div className={styles["confirm-div"]}>
					<input
						type="checkbox"
						id="agree"
						name="agree"
						className={styles["extra_info--checkbox--xK3ti"]}
						checked={state.agree}
						onChange={handleAgreeChange}
					/>
					<label htmlFor="agree">
						I agree to join Figma's mailing list
					</label>
				</div>
				<input
					type="submit"
					value="Send code"
					className={styles["create-account"]}
				/>
			</form>
			<p className={styles.subscript}>
				By clicking "Create account" or "Continue with Google", you
				agree to the <a href="#">Figma TOS</a> and{' '}
				<a href="#">Privacy Policy</a>.
			</p>
			<a className={styles["sign-on"]} href="#">
				Use single sign-on
			</a>
			<p className={styles["already-have-acc"]}>
				Already have an account? <a href="#">Log in</a>
			</p>
		</div>
	);
};
