import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../context/user-context';
import { changeBalance } from '../../utils/firebase';
import styles from './header.module.css';

const Header = () => {
    const [user, setUser] = useContext(UserContext);

    const logout = () => {
        setUser(null);
    }

    const add = () => {
      changeBalance(user?.username, 1000)
      .catch((err) => {
        console.error(err);
      })
    }

    return (
        user &&
        <header className={styles.header}>
        <div className={styles.profile}>
          <Link href="/">
            <img className={styles.logo} alt="Home" src="https://i.ibb.co/BfVRT1T/dynaflop-logo.png" />
          </Link>
          <Link href="/profile">
            <p className={styles.username}>{user?.username} - <span className={styles.balance}>{user?.balance}₽</span></p>
          </Link>
            <button className={styles.button} onClick={add}>Add Balance</button>
        </div>
        <img className={styles.logout} alt="Logout" src="https://cdn-icons-png.flaticon.com/512/126/126467.png" onClick={logout} />
      </header>
    )
}

export default Header;