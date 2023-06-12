import { useNavigate } from 'react-router-dom';
import styles from './HomeScreen.module.css';

export const HomeScreen = () => {

    const navigate = useNavigate();

    const clickHandler = (e) => {
        navigate(`/${e.target.innerText.toLowerCase()}`);
    }

    return (
        <div className={styles.container}>
            <h1>Welcome</h1>
            <div className={styles.buttons}>
                <a className={styles.button} onClick={clickHandler}>Login</a>
                <a className={styles.button} onClick={clickHandler}>Register</a>
            </div>

        </div>
    )
}