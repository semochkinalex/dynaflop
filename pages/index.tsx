import type { NextPage } from 'next'
import { useContext } from 'react'
import Authenticate from '../components/authenticate/authenticate'
import Events from '../components/events/events'
import { UserContext } from '../context/user-context'

import styles from './index.module.css';

const Home: NextPage = () => {

  const [user, setUser] = useContext(UserContext);

  return (
    <main className={styles.main}>
      {
        user ?
        <>
          <Events />
        </>
        :
          <Authenticate />
      }
    </main>
  )
}

export default Home

