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
            setEvents(res);
        })
        .catch((err) => {
            alert(`Fail fetch events, ${err}`);
        })
    }, [])

    return (
        <ul className={styles.container}>
            <div className={styles.heading}>
            <h2 className={styles.title}>Events</h2>
            <Link href="/events/create"><button className={styles.create}>Create Event</button></Link>
            </div>
            {
                events.map((el, i) => {
                    console.log(el)
                    return (
                        <Event {...el} />
                    )
                })
            }
            <p className={styles.disclamer}>* events displayed here are not updated in real-time. reload for most relevant information or choose the event itself</p>
        </ul>
    );
}

export default Events;