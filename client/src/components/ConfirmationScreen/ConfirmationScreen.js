import styles from './ConfirmationScreen.module.css';
import CheckMark from '../../imgs/checkmark.png';
import { useEffect, useState } from 'react';

export const ConfirmationScreen = () => {
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
			</div>
		</div>
    )
}