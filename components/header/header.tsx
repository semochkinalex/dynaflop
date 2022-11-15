import { useContext } from 'react';
import { UserContext } from '../../context/user-context';
import styles from './header.module.css';

const Header = () => {
    const [user, setUser] = useContext(UserContext);

    const logout = () => {
        setUser(null);
    }

    return (
        user &&
        <header className={styles.header}>
        <div className={styles.profile}>
          <img className={styles.avatar} alt="Avatar" src="https://www.pngarts.com/files/6/User-Avatar-in-Suit-PNG.png" />
          <p className={styles.username}>{user?.username} - <span className={styles.balance}>{user?.balance}₽</span></p>
          <button className={styles.button}>Add Balance</button>
        </div>
        <img className={styles.logout} alt="Logout" src="https://cdn-icons-png.flaticon.com/512/126/126467.png" onClick={logout} />
      </header>
    )
}

export default Header;