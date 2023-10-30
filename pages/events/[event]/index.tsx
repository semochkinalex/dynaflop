import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UserContext } from '../../../context/user-context';
import { buyTicket, togglePauseEvent, sellTicket, subscribeEvent } from '../../../utils/firebase';
import styles from './event.module.css';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { IEvent } from '../../../utils/types';

const Event = () => {
    const router = useRouter();
    const {event} = router.query as ParsedUrlQuery ;

    const [userData] = useContext(UserContext);
    const [eventData, setEventData] = useState<IEvent>();

    const [progressBarWidth, setProgressBarWidth] = useState(0);

    useEffect(() => {
        if (!event || typeof event != 'string') return; // typescript error-handling
        subscribeEvent(event, setEventData);
    }, [event]);

    const buy = () => {
        if (!event || typeof event != 'string') return; // typescript error-handling

        buyTicket(event, userData)
        .catch((err) => {
            alert(`Fail buy ticket, ${err}`);
        })
    }

    const sell = () => {
        if (!event || typeof event != 'string') return; // typescript error-handling
        
        sellTicket(event, userData)
        .catch((err) => {
            alert(`Fail sell ticket, ${err}`);
        })
    }

    useEffect(() => {
        setProgressBarWidth(((eventData?.currentPrice - eventData?.minPrice) / (eventData?.maxPrice - eventData?.minPrice)) * 100);
    }, [eventData]);

    const eventInterface = useMemo(() => {
        return (
            <>
            {
            userData?.username !== eventData?.host ? 
            (
                !eventData?.isClosed ?
                // if event is open and the person is not the host
                    <div className={styles.buttons}>
                        <button disabled={(userData?.balance < eventData?.currentPrice) || eventData?.numberOfAvailableTickets == 0 || !userData} className={`${styles.buy} ${styles.button}`} type="submit" onClick={buy}>Buy ticket for {eventData?.currentPrice}</button>

                        <button disabled={userData && !eventData?.attendees[userData?.username] || !userData} className={`${styles.sell} ${styles.button}`} type="submit" onClick={sell}>Sell ticket for {eventData?.currentPrice - eventData?.slippage}</button>
                    </div>
                :
                // if the event is closed
                    <p className={styles.isClosed}>The event is closed</p>
            )
            :
            // if it's the host
            <button className={styles.archiveButton} onClick={() => togglePauseEvent(eventData.name, userData.username, !eventData.isClosed)}>{eventData?.isClosed ? "Unpause this event" : "Pause this event"}</button>
            }
            {
                // if user has tickets -> we display them
                userData && userData?.tickets && eventData?.attendees[userData?.username] ?
                <p className={styles.hint}>You have {eventData?.attendees[userData?.username]} ticket (s)</p>
                :
                ''
            }
            </>
        )
    }, [userData, eventData, togglePauseEvent, styles]);

    return (
        eventData ?
        <main className={styles.main}>
            <p className={styles.name}>Event: {event}</p>
            <span className={styles.host}>By {eventData?.host}. Number of tickets: {eventData?.numberOfAvailableTickets}/{eventData?.numberOfTotalTickets}</span> 

            <div className={styles.tags}>
                <p className={styles.tag}>${eventData?.minPrice}</p>
                
                <p className={styles.tag}>${eventData?.maxPrice}</p>
            </div>
            
            <div className={styles.bar}><div className={styles.progress} style={{ width: `${progressBarWidth}%` }}></div></div>

            <div className={styles.tags}>
                <p className={styles.tag}>Min. price</p>
                
                <p className={styles.tag}>Max. price</p>
            </div>

            {eventInterface}

        </main>
        :
        <main className={styles.main}>
            <p>Could not find the event</p>  
            <Link href="/events/create"><button className={styles.create}>Create Event</button></Link>
        </main>
    )
}

export default Event;