import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../context/user-context';
import styles from './profile.module.css';

const Profile = () => {
    const [user] = useContext(UserContext);
    
    return (
        <main className={styles.main}>
            <img className={styles.avatar} alt="Avatar" src="https://www.pngarts.com/files/6/User-Avatar-in-Suit-PNG.png" />
            <p className={styles.name}>{user?.username}</p>
            <p className={styles.balance}>Balance: ${user?.balance}</p>
            <div className={styles.row}>
                <p>Name</p>
                <p>Amount of tickets</p>
            </div>
            <ul className={styles.list}>
            {
                user?.tickets ?
                Object.entries(user?.tickets).map(([name, quantity], i) => {
                    // console.log(name)
                    return (
                        <Link href={`/events/${name}`} key={i}>
                            <li className={styles.element}>

                            <p className={`${styles.event} ${styles.text}`}>{name}</p>

                            <p className={`${styles.text} ${styles.price}`}>{quantity} tickets</p>

                            </li>
                        </Link>
                    )
                })
                :
                <p className={styles.none}>You seem to have no tickets :(</p>
            }
            </ul>
        </main>
    );
}

export default Profile;