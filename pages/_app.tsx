import type { AppProps } from 'next/app';

import '../global.css';

import styles from './app.module.css';

import { UserContext } from '../context/user-context';
import { useEffect, useState } from 'react';
import { subscribeUser } from '../utils/firebase';
import { IUser } from '../utils/types';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {

  const [unsubscribe, setUnsubscribe] = useState();
  const router = useRouter();
  const state = useState<null | IUser>(null);

  const [user, setUser] = state;

  useEffect(() => {
    let unsubscribe;
    const loadedUsername = localStorage.getItem("username"); 

    if (loadedUsername) {
      
      unsubscribe = subscribeUser(loadedUsername, (user) => {
        setUser(user);
      })

    }
  }, [])

  useEffect(() => {
    localStorage.setItem("username", user?.username || '');
  }, [user]);

  

  return (
    <UserContext.Provider value={state}>
      <header className={styles.header}>
        <div className={styles.profile}>
          <img className={styles.avatar} alt="Avatar" src="https://www.pngarts.com/files/6/User-Avatar-in-Suit-PNG.png" />
          <p className={styles.username}>{user?.username} - <span className={styles.balance}>{user?.balance}₽</span></p>
          <button className={styles.button}>Add Balance</button>
        </div>
        {/* <div className={styles.balance}>
        </div> */}
        <img className={styles.logout} alt="Logout" src="https://cdn-icons-png.flaticon.com/512/126/126467.png" />
      </header>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp

// https://colorhunt.co/palette/272343ffffffe3f6f5bae8e8