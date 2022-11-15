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
            <h2 className={styles.title}>Events</h2>
            {
                events.map((el, i) => {
                    console.log(el)
                    return (
                        <Event {...el} />
                    )
                })
            }
        </ul>
    );
}

export default Events;