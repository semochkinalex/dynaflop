import type { AppProps } from 'next/app';

import '../global.css';

import { UserContext } from '../context/user-context';
import { useEffect, useRef, useState } from 'react';
import { subscribeUser } from '../utils/firebase';
import { IUser } from '../utils/types';
import { useRouter } from 'next/router';
import Header from '../components/header/header';

function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter();

  const state = useState<null | IUser>(null);
  const [user, setUser] = state;

  useEffect(() => {

    const loadedUsername = localStorage.getItem("username"); 
    const loadedEncryptedPassword = localStorage.getItem("hashedPassword"); 

    if (loadedUsername && loadedEncryptedPassword) {
      
      subscribeUser(loadedUsername, loadedEncryptedPassword, (userData) => {
          setUser(userData);
      })

    }
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      localStorage.setItem("username", user?.username || '');
      localStorage.setItem("hashedPassword", user?.password || '');
    }

  }, [user]);

  return (
    <UserContext.Provider value={state}>
      <Header />
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}


export default MyApp;
