import type { NextPage } from 'next'
import { useContext, useEffect } from 'react'
import Authenticate from '../components/authenticate/authenticate'
import Profile from '../components/profile/profile'
import { UserContext } from '../context/user-context'
import { signupUser, subscribeUser } from '../utils/firebase'

const Home: NextPage = () => {

  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    // const unsub = subscribeUser('fennyflop', console.log)

    // return async () => unsub();
  }, [])

  return (
    <main>
      {
        user ?
        <Profile />
        :
        <Authenticate />
      }
    </main>
  )
}

export default Home
