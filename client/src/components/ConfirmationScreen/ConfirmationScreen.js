import styles from './ConfirmationScreen.module.css';
import CheckMark from '../../imgs/checkmark.png';

export const ConfirmationScreen = ({toVerify}) => {
    return (
        <div className={styles.container}>
			{
				toVerify === 'mobile' ?
				<h3>Verify your mobile number</h3>
				:
				<h3>Verify your email address</h3>
			}
			<div className={styles.loginDiv}>
				<div className={styles.progressBar}>
					<div className={styles.progress}></div>
				</div>
				<img src={CheckMark} alt="checkmark" />
                <h4>Verification successful!</h4>
			</div>
		</div>
    )
}