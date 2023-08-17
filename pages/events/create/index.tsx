import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { UserContext } from '../../../context/user-context';
import { buyTicket, createEvent, isEventNameAvailable, sellTicket, subscribeEvent } from '../../../utils/firebase';
import styles from './create.module.css';
import { ICreateEventInputs } from '../../../utils/types';

const Create = () => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [userData] = useContext(UserContext);
    
    const [inputs, setInputs] = useState<ICreateEventInputs | {}>({});

    const handleInput = e => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputs) return setErrorMessage("Invalid inputs");

        const {name, max, start, numberOfTotalTickets, slippage} = inputs as ICreateEventInputs;
        
        if (start > max) return setErrorMessage("Starting price can't be higher than the max");
        if (start <= 0 ||  max <= 0 || numberOfTotalTickets <= 0 || slippage <= 0) return setErrorMessage("The starting, maximum, slippage and the number of tickets must be above zero");

        isEventNameAvailable(name).then((isAvailable) => {
            if (!isAvailable) {
                return setErrorMessage("Event name is taken")
            } else {
                createEvent(name, userData?.username, start, max, numberOfTotalTickets, slippage)
                .then(() => {
                    router.push(`/events/${name}`)
                })
                .catch((error) => {
                    setErrorMessage(error);
                })
            }

        })

    }

    return (
        <main className={styles.main}>
            <form className={styles.form} onSubmit={handleSubmit}>
            <h1 className={styles.title}>Start the change!</h1>
                <fieldset className={styles.fieldset}>
                    <label className={styles.label} htmlFor="name">Name of your event</label>
                    <input value={inputs['name']} id="name" onChange={handleInput} className={styles.input} type="text" name="name" placeholder="Alex's computer science workshop" required />
                </fieldset>
                <fieldset className={styles.fieldset}>
                    <label className={styles.label} htmlFor="start">Dynamic pricing settings</label>
                    <input value={inputs['start']} onChange={handleInput} className={styles.input} type="number" name="start" placeholder='Starting price - $10' required />
                    <input value={inputs['max']} onChange={handleInput} className={styles.input} type="number" name="max" placeholder='Maximum price - $30' required />
                    <input value={inputs['numberOfTotalTickets']} onChange={handleInput} className={styles.input} type="number" name="numberOfTotalTickets" min={0} placeholder='Number of tickets - 100' required />
                    <input value={inputs['slippage']} onChange={handleInput} className={styles.input} type="number" name="slippage" placeholder='Slippage in USD - $1' required />
                    <span className={styles.hint}>^ Input only numerical data. Fields above are examples.</span>
                    <p className={styles.error}>{errorMessage}</p>
                </fieldset>
                <button className={styles.create} type="submit">Create Event</button>
            </form>
        </main>
    )
}

export default Create;