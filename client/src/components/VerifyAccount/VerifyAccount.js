import { useState } from 'react';
import ENDPOINTS from '../../endpoints';
import PhoneImg from '../../imgs/phone.png';
import Envelope from '../../imgs/envelope.png';
import styles from './VerifyAccount.module.css';
import { useTimer } from '../../hooks/useTimer';
import BackArrow from '../../imgs/back-arrow.png';
import ErrorIcon from '../../imgs/input-error.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoadingEffect } from '../../hooks/useLoadingEffect';

export const VerifyAccount = () => {
	const navigate = useNavigate();
	const location = useLocation();
	
	const { style } = useLoadingEffect('65%');
	const phone = sessionStorage.getItem('phone');
	const email = sessionStorage.getItem('email');
	const toVerify = location.pathname.split('/').pop().split('-').pop();

	const [error, setError] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const { timer, getTimeRemaining } = useTimer(60);

	const handleChange = (e) => {
		setInputValue(e.target.value);
	};

	const handleResetCode = () => {
		setError(null);

		fetch(ENDPOINTS.RESET_CODE, {
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
				if (data.error) {
					setError(data.error);
					return;
				}
				getTimeRemaining();
				console.log(data.code);
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!inputValue) {
			setError('Please enter a verification code!');
			return;
		}

		fetch(ENDPOINTS.VERIFY, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				code: inputValue,
				phone,
				email,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					setError(data.error);
					return;
				}

				setError(null);
				sessionStorage.clear();
				localStorage.setItem('id', data);
				navigate('/auth/confirm');
			});
	};

	return (
		<div className={styles.container}>
			{toVerify === 'mobile' ? (
				<h3>Verify your mobile number</h3>
			) : (
				<h3>Verify your email address</h3>
			)}
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
					{toVerify === 'mobile' ? (
						<h5>
							A 6-digit code has been sent as a text message to{' '}
							<span>{sessionStorage.getItem('phone')}</span>
						</h5>
					) : (
						<h5>
							A 6-digit code has been sent as an email to{' '}
							<span>{sessionStorage.getItem('email')}</span>
						</h5>
					)}
				</div>
				{toVerify === 'mobile' ? (
					<img
						className={styles.phone}
						src={PhoneImg}
						alt="phone-icon"
					/>
				) : (
					<img
						className={styles.phone}
						src={Envelope}
						alt="phone-icon"
					/>
				)}
				{timer > 0 ? (
					<p className={styles.timer}>{timer}</p>
				) : (
					<div className={styles.expirationErrorDiv}>
						<p>Verification code has expired!</p>
					</div>
				)}
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.inputDiv}>
						<label htmlFor="verificationCode">
							VERIFICATION CODE
						</label>
						<input
							type="tel"
							name="verificationCode"
							id="verificationCode"
							placeholder="Enter 6-digit verification code here"
							value={inputValue}
							onChange={handleChange}
						/>
						{error && (
							<img
								className={styles.errorIcon}
								src={ErrorIcon}
								alt="error-icon"
							/>
						)}
						{error && (
							<div className={styles.errorDiv}>
								<p>{error}</p>
							</div>
						)}
					</div>

					<button>CREATE ACCOUNT</button>
				</form>
				<div className={styles.subscriptDiv}>
					<p>
						Didn't receive code in time?{' '}
						<button
							onClick={handleResetCode}
							disabled={timer > 0}
							style={timer > 0 ? { color: 'grey' } : {}}
						>
							Resend Code
						</button>
					</p>
					<p>OR</p>
					<p>
						{toVerify === 'mobile' ? (
							<button
								onClick={() => navigate('/auth/verify-email')}
							>
								Send verification code on email
							</button>
						) : (
							<button
								onClick={() => navigate('/auth/verify-mobile')}
							>
								Send verification code on mobile no.
							</button>
						)}
					</p>
				</div>
			</div>
		</div>
	);
};
