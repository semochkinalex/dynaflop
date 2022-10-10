import type { NextPage } from 'next'
import { useEffect } from 'react'
import Authenticate from '../components/authenticate/authenticate'
import { signupUser, subscribeUser } from '../utils/firebase'

const Home: NextPage = () => {

  useEffect(() => {
    // const unsub = subscribeUser('fennyflop', console.log)

    // return async () => unsub();
  }, [])

  return (
    <main>
      <Authenticate />
    </main>
  )
}

export default Home
