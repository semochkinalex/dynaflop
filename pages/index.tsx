import type { NextPage } from 'next'
import { useEffect } from 'react'
import { signupUser, subscribeUser } from '../utils/firebase'

const Home: NextPage = () => {

  useEffect(() => {
    const unsub = subscribeUser('fennyflop', console.log)

    // return async () => unsub();
  }, [])

  return (
    <div>
    
    </div>
  )
}

export default Home
