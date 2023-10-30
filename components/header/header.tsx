import Link from 'next/link';
import { FC, useContext } from 'react';
import { UserContext } from '../../context/user-context';
import { changeBalance } from '../../utils/firebase';
import styles from './header.module.css';
import Image from 'next/image';

const Header = () => {
    const [user, setUser] = useContext(UserContext);

    const logout = () => {
      setUser(null);
      localStorage.removeItem("username");
      localStorage.removeItem("hashedPassword");
    }

    const add = () => {
      changeBalance(user?.username, 1000)
      .catch((err) => {
        alert(`Fail add balance, ${err}`);
      })
    }

    return (
        user &&
        <header className={styles.header}>
        <div className={styles.profile}>
          <Link href="/">
            {/* image can't we wrapped by link, because they're nextjs elements and require a forward ref */}
            <div> 
              <Image className={styles.logo} alt="Home" width={50} height={50} src="https://cdn-icons-png.flaticon.com/512/5132/5132722.png" />
            </div>
          </Link>
          <Link href="/profile">
            <p className={styles.username}>{user?.username} - <span className={styles.balance}>${user?.balance}</span></p>
          </Link>
            <button className={styles.button} onClick={add}>Add Balance</button>
        </div>
        <Image className={styles.logout} alt="Logout" src="/exit.png" onClick={logout} width={30} height={30} />
      </header>
    )
}

export default Header;

