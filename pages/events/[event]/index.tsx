// import Authenticate from '../../components/authenticate/authenticate';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import SetOrder from '../../../components/set-order/set-order';
import { UserContext } from '../../../context/user-context';
import { buyTicket, sellTicket, subscribeEvent } from '../../../utils/firebase';
import styles from './event.module.css';

const Event = () => {
    const router = useRouter();
    const [userData] = useContext(UserContext);

    const [eventData, setEventData] = useState();

    const {event} = router.query;

    useEffect(() => {
        if (!event) return;
        subscribeEvent(event, setEventData);
    }, [event]);

    const buy = () => {
        buyTicket(event, userData)
        .catch((err) => {
            console.log(err);
        })
    }

    const sell = () => {
        sellTicket(event, userData)
        .catch((err) => {
            console.log(err);
        })
    }


    return (
        <main>
            <p className={styles.name}>Event: {event}</p>
            
            <p className={styles.name}>Available: {eventData?.available}</p>
            <p>Current price: {eventData?.currentPrice}</p>
            <ul className={styles.buy}>
                {
                    eventData && eventData?.buy?.map((order, i) => {
                        return (
                            <li className={styles.order}>
                                <p>Type: BUY</p>
                                <p>User: {order.username}</p>
                                <p>Quantity: {order.quantity}</p>
                                <p>Price: {order.price}</p>
                                <p>Volume: {order.price * order.quantity}</p> 
                            </li>
                        );
                    })
                }
                {
                    eventData && eventData?.sell?.map((order, i) => {
                        return (
                            <li className={`${styles.order} ${styles.sell}`}>
                                <p>Type: SELL</p>
                                <p>User: {order.username}</p>
                                <p>Quantity: {order.quantity}</p>
                                <p>Price: {order.price}</p>
                                <p>Volume: {order.price * order.quantity}</p> 
                            </li>
                        );
                    })
                }
            </ul>
            <button type="submit" onClick={buy}>Buy ticket for {eventData?.currentPrice}</button>
            
            <button type="submit" onClick={sell}>Sell ticket for {eventData?.currentPrice - eventData?.slippage}</button>
            {/* <SetOrder minPrice={eventData?.minPrice} maxPrice={eventData?.maxPrice} onSubmit={handleSetOrder} /> */}
        </main>
    )
}

export default Event;