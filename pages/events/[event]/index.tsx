// import Authenticate from '../../components/authenticate/authenticate';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import SetOrder from '../../../components/set-order/set-order';
import { UserContext } from '../../../context/user-context';
import { buyTicket, togglePauseEvent, sellTicket, subscribeEvent } from '../../../utils/firebase';
import styles from './event.module.css';

const Event = () => {
    const router = useRouter();
    const [userData] = useContext(UserContext);

    const [eventData, setEventData] = useState();

    console.log(userData?.tickets)

    const {event} = router.query;

    useEffect(() => {
        if (!event) return;
        subscribeEvent(event, setEventData);
    }, [event]);

    const buy = () => {
        buyTicket(event, userData)
        .catch((err) => {
            alert(`Fail buy ticket, ${err}`);
        })
    }

    const sell = () => {
        sellTicket(event, userData)
        .catch((err) => {
            alert(`Fail sell ticket, ${err}`);
        })
    }

    // console.log(((eventData?.currentPrice - eventData?.minPrice) / (eventData.maxPrice - eventData?.minPrice)) * 100)
    return (
        <main className={styles.main}>
            <p className={styles.name}>Event: {event}</p>
            <span className={styles.host}>By {eventData?.host}. Number of tickets: {eventData?.available}/{eventData?.quantity}</span> 

            <div className={styles.tags}>
                <p className={styles.tag}>${eventData?.minPrice}</p>
                
                <p className={styles.tag}>${eventData?.maxPrice}</p>
            </div>
            
            <div className={styles.bar}><div className={styles.progress} style={{
                width: `${((eventData?.currentPrice - eventData?.minPrice) / (eventData?.maxPrice - eventData?.minPrice)) * 100}%`
            }}></div></div>

            <div className={styles.tags}>
                <p className={styles.tag}>Min. price</p>
                
                <p className={styles.tag}>Max. price</p>
            </div>

            {
                userData?.username !== eventData?.host ? 
                (
                !eventData?.closed 
                ?
                <div className={styles.buttons}>
                    <button disabled={(userData?.balance < eventData?.currentPrice) || eventData?.available == 0} className={`${styles.buy} ${styles.button}`} type="submit" onClick={buy}>Buy ticket for {eventData?.currentPrice}</button>

                    <button disabled={userData && userData?.tickets && !eventData?.attendees[userData?.username]} className={`${styles.sell} ${styles.button}`} type="submit" onClick={sell}>Sell ticket for {eventData?.currentPrice - eventData?.slippage}</button>
                </div>
                :
                <p className={styles.closed}>The event is closed</p>
                )
                :
                <button className={styles.archiveButton} onClick={() => togglePauseEvent(eventData.name, userData.username, !eventData.closed)}>{eventData?.closed ? "Unpause this event" : "Pause this event"}</button>
            }

            {
                userData && userData?.tickets && eventData?.attendees[userData?.username] ?
                <p className={styles.hint}>You have {eventData?.attendees[userData?.username]} ticket (s)</p>
                :
                ''
            }
            {/* <SetOrder minPrice={eventData?.minPrice} maxPrice={eventData?.maxPrice} onSubmit={handleSetOrder} /> */}
        </main>
    )
}

export default Event;