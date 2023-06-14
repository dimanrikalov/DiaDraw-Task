import styles from './HomeScreen.module.css';
import { useNavigate } from 'react-router-dom';
import newUserImage from '../../imgs/user-x.png';
import oldUserImage from '../../imgs/user-box.png';

export const HomeScreen = () => {
	const navigate = useNavigate();

	return (
		<div className={styles.container}>
			<div className={styles.titleDiv}>
				<h3>Welcome to Website</h3>
				<h5>Keeping Communities Connected</h5>
			</div>
			<div className={styles.options}>
				<div className={styles.option}>
					<img
						className={styles.img}
						src={newUserImage}
						alt="new-user"
					/>
					<div className={styles.rightSide}>
						<h4>I'm new user</h4>
						<button onClick={() => navigate('/auth/register')}>
							CREATE ACCOUNT
						</button>
					</div>
				</div>
				<div className={styles.option}>
					<img
						className={styles.img}
						src={oldUserImage}
						alt="old-user"
					/>
					<div className={styles.rightSide}>
						<h4>I have an account</h4>
						<button onClick={() => navigate('/auth/login')}>
							LOGIN NOW
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
