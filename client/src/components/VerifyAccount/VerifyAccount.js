import React, { useState } from 'react';
import OTPInput from 'otp-input-react';
import styles from './VerifyAccount.module.css';
import ENDPOINTS from '../../endpoints';
import { useNavigate } from 'react-router-dom';

import BackArrow from '../../imgs/back-arrow.png';
import PhoneImg from '../../imgs/phone.png';
import ErrorIcon from '../../imgs/input-error.png';
import Envelope from '../../imgs/envelope.png';

export function VerifyAccount({ toVerify }) {
	const navigate = useNavigate();
	const [OTP, setOTP] = useState('');
	const [error, setError] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (toVerify === 'mobile') {
			navigate('/confirm-mobile');
		} else {
			navigate('/confirm-email');
		}
		// fetch(ENDPOINTS.VERIFY, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({
		// 		code: OTP,
		// 	}),
		// })
		// 	.then((res) => res.json())
		// 	.then((data) => {
		// 		if (data) {
		// 			setError(null);
		// 			localStorage.clear();
		// 			localStorage.setItem('id', data);
		// 			navigate('/user');
		// 		} else {
		// 			setError('Invalid code! Please try again!');
		// 		}
		// 	});
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
					<div className={styles.progress}></div>
				</div>
				<div className={styles.titleDiv}>
					<a onClick={() => navigate(-1)}>
						<img
							className={styles.arrow}
							src={BackArrow}
							alt="back-arrow"
						/>
					</a>
					{toVerify === 'mobile' ? (
						<h5>
							A 6-digit code has been sent as a text messge to{' '}
							<span>+1 900-00-1234</span>
						</h5>
					) : (
						<h5>
							A 6-digit code has been sent to{' '}
							<span>youremail@emaildomain.com</span>
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
				<form
					action="#"
					className={styles.form}
					onSubmit={handleSubmit}
				>
					<div className={styles.inputDiv}>
						<label htmlFor="telephone">VERIFICATION CODE</label>
						<input
							type="tel"
							name="telephone"
							id="telephone"
							placeholder="Enter 6-digit verification code here"
						/>
						<img
							className={styles.errorIcon}
							src={ErrorIcon}
							alt="error-icon"
						/>
						<div className={styles.errorDiv}>
							<p>Invalid verification code!</p>
						</div>
					</div>

					<button>CREATE ACCOUNT</button>
				</form>
				<div className={styles.subscriptDiv}>
					<p>
						Didn't receive code? <a href="#">Resend Code</a>
					</p>
					<p>OR</p>
					<p>
						{toVerify === 'mobile' ? (
							<a href="/verify-email">
								Send verification code on email
							</a>
						) : (
							<a href="/verify-mobile">
								Send verification code on mobile no.
							</a>
						)}
					</p>
				</div>
			</div>
		</div>
	);
}
