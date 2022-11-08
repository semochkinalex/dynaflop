import type { AppProps } from 'next/app';

import '../global.css';

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
    console.log(user?.username)
  }, [user])

  return (
    <UserContext.Provider value={state}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp

// https://colorhunt.co/palette/272343ffffffe3f6f5bae8e8