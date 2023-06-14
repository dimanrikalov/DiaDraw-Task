import { useNavigate } from 'react-router-dom';
import CheckMark from '../../imgs/checkmark.png';
import styles from './ConfirmationScreen.module.css';
import { useLoadingEffect } from '../../hooks/useLoadingEffect';

export const ConfirmationScreen = () => {
	const navigate = useNavigate();
	const { style } = useLoadingEffect('100%');

	const logoutHandler = () => {
		localStorage.removeItem('id');
		navigate('/');
	};

	return (
		<div className={styles.container}>
			<h3>Verification successful!</h3>
			<div className={styles.loginDiv}>
				<div className={styles.progressBar}>
					<div className={styles.progress} style={style}></div>
				</div>
				<img src={CheckMark} alt="checkmark" />
				<h4>Verification successful!</h4>
				<button
					onClick={() => navigate('/login-entries')}
					className={styles.button}
				>
					VIEW LOGIN ENTRIES
				</button>
				<button onClick={logoutHandler} className={styles.button}>
					LOGOUT
				</button>
			</div>
		</div>
	);
};
