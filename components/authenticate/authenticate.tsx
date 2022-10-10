import { FC, useState } from 'react';
import { authenticateUser } from '../../utils/firebase';
import styles from './authenticate.module.css';

import { UserContext } from '../../context/user-context';

const Authenticate: FC = () => {

    const [username, setUsername] = useState<string>('');
    // const [user, ]

    const onAuthenticate = (e: any) => {
        e.preventDefault();
        authenticateUser(username)
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return (
        <form className={styles.container} onSubmit={onAuthenticate}>
            <h1 className={styles.title}>Authenticate</h1>
            <fieldset className={styles.fieldset}>
                <label className={styles.label} htmlFor="username">Username:</label>
                <input className={styles.input} id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </fieldset>
            <button className={styles.submit}>Submit</button>
        </form>
    );
}

export default Authenticate;