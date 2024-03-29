import { FC, useContext, useState } from 'react';
import { authenticateUser, subscribeUser } from '../../utils/firebase';
import styles from './authenticate.module.css';

import { UserContext } from '../../context/user-context';

const Authenticate: FC = () => {

    const [errorMessage, setErrorMessage] = useState<string>('');

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const loginRegexp = new RegExp(/^[a-zA-Z]*$/);

    
    const [user, setUser] = useContext(UserContext);

    const onAuthenticate = (e: any) => {
        e.preventDefault();
        console.log(username.length, username.length >= 2)
        if (!username || !password) return setErrorMessage("You must complete both fields");
        if (!loginRegexp.test(username) || username.length < 2 || username.length > 50) return setErrorMessage("Username must contain only letters and have between 2-50 characters");
        
        authenticateUser(username, password)
        .then((user) => {
            subscribeUser(username, user.password, (data) => {
                setUser(data);
            })
        })
        .catch((err) => {
            setErrorMessage(err);
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
            <fieldset className={styles.fieldset}>
                <label className={styles.label} htmlFor="password">Password:</label>
                <input className={styles.input} id="password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
            </fieldset>
            <p className={styles.error}>{errorMessage}</p>
            <button className={styles.submit} type="submit">Submit</button>
        </form>
    );
}

export default Authenticate;

