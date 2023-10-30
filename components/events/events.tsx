import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchEvents } from '../../utils/firebase';
import Event from '../event/event';
import styles from './events.module.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [lastUpdatedTime, setLastUpdatedTime] = useState<Date | number>();

    const getEvents = () => {
        fetchEvents()
        .then((res) => {
            setEvents(res);
            setLastUpdatedTime(Date.now());
        })
        .catch((err) => {
            alert(`Fail fetch events, ${err}`);
        })
    }

    useEffect(() => {
        // initial fetch
        getEvents();
    
        // repeating fetch
        const interval = setInterval(() => {
            getEvents();
        }, 5000);

        // clear interval and make sure no unnecessary updates happen
        return () => clearInterval(interval);
    }, [])

    return (
            events?.length ?
            <>
                <ul className={styles.container}>
                <div className={styles.heading}>
                <h2 className={styles.title}>Events</h2>
                <Link href="/events/create"><button className={styles.create}>Create Event</button></Link>
                </div>
                {
                    events.filter((event) => !event?.isClosed).map((event, i) => {
                        return (
                            <Event key={i} {...event} />
                        )
                    })
                }
                <p className={styles.disclamer}>Last updated: {new Date(lastUpdatedTime).toUTCString()}</p>
                </ul>
            </>
            :
            <section className={styles.container}>
                <h2 className={styles.empty}>There are no events yet. Start the change!</h2>
                <Link href="/events/create"><button className={styles.create}>Create Event</button></Link>
            </section>
    );
}

export default Events;

