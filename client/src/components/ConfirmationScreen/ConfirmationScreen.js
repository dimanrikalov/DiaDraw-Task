import styles from './ConfirmationScreen.module.css';
import CheckMark from '../../imgs/checkmark.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ConfirmationScreen = () => {
	const navigate = useNavigate();
	const [style, setStyle] = useState({});

	useEffect(() => {
		const timeout = setTimeout(() => {
			setStyle({width: '100%'});
		}, 100);

		return () => {
			clearTimeout(timeout);
		}
	}, []);

    return (
        <div className={styles.container}>
			<h3>Verification successful!</h3>
			<div className={styles.loginDiv}>
				<div className={styles.progressBar}>
					<div className={styles.progress} style={style}></div>
				</div>
				<img src={CheckMark} alt="checkmark" />
                <h4>Verification successful!</h4>
				<button onClick={()=>navigate('/login-entries')} className={styles.button}>View Login Entries</button>
			</div>
		</div>
    )
}