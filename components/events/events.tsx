import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchEvents } from '../../utils/firebase';
import Event from '../event/event';
import styles from './events.module.css';

const Events = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents()
        .then((res) => {
            console.log('wqdqw');
            setEvents(res);
        })
        .catch((err) => {
            console.log('qwd')
        })
    }, [])

    return (
        <ul className={styles.container}>
            {
                events.map((el, i) => {
                    console.log(el)
                    return (
                        <Event {...el} />
                        // <li className={styles.event}>
                        //     <p className={styles.name}>{el.name}</p>
                        //     <Link href={`/events/${el.name}`}><button>Visit event</button></Link>
                        // </li>
                    )
                })
            }
        </ul>
    );
}

export default Events;