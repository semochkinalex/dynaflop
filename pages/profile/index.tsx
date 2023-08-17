import Link from 'next/link';
import { useCallback, useContext, useMemo } from 'react';
import { UserContext } from '../../context/user-context';
import styles from './profile.module.css';
import Image from 'next/image';

const Profile = () => {
    const [user] = useContext(UserContext);

    const tickets = useMemo(() => {
        return (
            user?.tickets ?
                Object.entries(user?.tickets).map(([name, numberOfTotalTickets], i) => {
                    return (
                        <Link href={`/events/${name}`} key={i}>
                            <li className={styles.element}>

                            <p className={`${styles.event} ${styles.text}`}>{name}</p>

                            <p className={`${styles.text} ${styles.price}`}>{numberOfTotalTickets as unknown as number} tickets</p>

                            </li>
                        </Link>
                    )
                })
                :
                <p className={styles.none}>You seem to have no tickets :(</p>
        )
    }, [user]);
    
    return (
        <main className={styles.main}>
            {/* <Image className={styles.avatar} alt="Avatar" src="/avatar.png" width={150} height={150} />
            <p className={styles.name}>{user?.username}</p>
            <p className={styles.balance}>Balance: ${user?.balance}</p>
            <div className={styles.row}>
                <p>Name</p>
                <p>Amount of tickets</p>
            </div>
            <ul className={styles.list}>
            { tickets }
            </ul> */}
        </main>
    );
}

export default Profile;