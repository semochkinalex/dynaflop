// import Authenticate from '../../components/authenticate/authenticate';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../../context/user-context';
import { buyTicket, createEvent, sellTicket, subscribeEvent } from '../../../utils/firebase';
import styles from './create.module.css';

const Create = () => {
    const [userData] = useContext(UserContext);
    
    const [inputs, setInputs] = useState({});

    const handleInput = e => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputs) return;
        const {name, min, max, start, quantity, slippage} = inputs;
        createEvent(name, userData?.username, start, min, max, quantity, slippage)
        .catch((err) => {
            console.log(err);
        })
    }

    return (
        <main>
            <form onSubmit={handleSubmit}>
                <input value={inputs['name']} onChange={handleInput} className={styles.input} type="text" name="name" placeholder='Event Name' required />
                <input value={inputs['start']} onChange={handleInput} className={styles.input} type="number" name="start" placeholder='Starting price' required />
                <input value={inputs['min']} onChange={handleInput} className={styles.input} type="number" name="min" min={0} placeholder='Minimum price' required />
                <input value={inputs['max']} onChange={handleInput} className={styles.input} type="number" name="max" placeholder='Maximum price' required />
                <input value={inputs['quantity']} onChange={handleInput} className={styles.input} type="number" name="quantity" min={0} placeholder='Number of tickets' required />
                <input value={inputs['slippage']} onChange={handleInput} className={styles.input} type="number" name="slippage" placeholder='Slippage in rubles' required />
                <button type="submit">Create Event</button>
            </form>
        </main>
    )
}

export default Create;