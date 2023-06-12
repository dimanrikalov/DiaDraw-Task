import React, { useState } from 'react';
import OTPInput from 'otp-input-react';
import styles from './VerifyAccount.module.css';

export function VerifyAccount() {
	const [OTP, setOTP] = useState('');
	return (
        <div className={styles.container}>
        <h1>We sent you a code. Please type it in the field below.</h1>
			<OTPInput
            style={{display: 'flex', justifyContent: 'space-between'}}
				inputStyles={{ width: 42, height: 64, padding: 0, fontSize: 28, margin: 0, color: 'black', backgroundColor: '#dcdcdc' }}
				value={OTP}
				onChange={setOTP}
				autoFocus
				OTPLength={6}
				otpType="number"
				disabled={false}
			/>
			<div>
				<button className={styles.submitBtn}>Confirm</button>
			</div>
		</div>
	);
}
