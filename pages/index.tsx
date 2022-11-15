import type { NextPage } from 'next'
import { useContext, useEffect } from 'react'
import Authenticate from '../components/authenticate/authenticate'
import Events from '../components/events/events'
import Profile from '../components/profile/profile'
import { UserContext } from '../context/user-context'
import { signupUser, subscribeUser } from '../utils/firebase'

import styles from './index.module.css';

const Home: NextPage = () => {

  const [user, setUser] = useContext(UserContext);

  return (
    <main className={styles.main}>
      {
        user ?
        <>
          <Events />
          {/* <Profile /> */}
        </>
        :
        <Authenticate />
      }
    </main>
  )
}

export default Home
