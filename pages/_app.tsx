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
  const { asPath } = useRouter();

  const state = useState<null | IUser>(null);
  const [user, setUser] = state;

  // To save routing history (if someone enters a specific route he can return to it after authentication)
  const ref = useRef<string>("/");

  useEffect(() => {
    ref.current = asPath;
  }, [asPath]);

  useEffect(() => {

    const loadedUsername = localStorage.getItem("username"); 

    if (loadedUsername) {
      
      subscribeUser(loadedUsername, (data) => {
          setUser(data);
          router.push(ref.current);
      })

    }
  }, [])

  useEffect(() => {
    localStorage.setItem("username", user?.username || '');

    router.push(user ? ref.current : '/');
  }, [user]);

  return (
    <UserContext.Provider value={state}>
      <Header />
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp
