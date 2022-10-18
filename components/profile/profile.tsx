import { useContext } from 'react';
import { UserContext } from '../../context/user-context';
import { changeBalance } from '../../utils/firebase';
import styles from './profile.module.css';

const Profile = () => {

    const [user, setUser] = useContext(UserContext);

    const logout = () => {
        setUser(null);
    }

    const handleBalance = (n: number) => {
        changeBalance(user?.username, n);
    }

    return (
            user ?
            <section className={styles.profile}>
                <p>Username: {user?.username}</p>
                <p>Balance: {user?.balance}</p>
                <button onClick={logout}>Logout</button>
                <div className={styles.data}>
                    <button className={styles.button} onClick={() => handleBalance(1000)}>Add 1000 rub</button>
                
                    <button className={styles.button} onClick={() => handleBalance(-1000)}>Subtract 1000 rub</button>
                </div>
            </section>
            :
            <></>
    );
}

export default Profile;