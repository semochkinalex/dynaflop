// import Authenticate from '../../components/authenticate/authenticate';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SetOrder from '../../../components/set-order/set-order';
import { subscribeEvent } from '../../../utils/firebase';
import styles from './event.module.css';

const Auth = () => {
    const router = useRouter();

    const [eventData, setEventData] = useState();

    const {event} = router.query;

    useEffect(() => {
        if (!event) return;
        subscribeEvent(event, setEventData);
    }, []);

    const handleSetOrder = (price, quantity) => {
        console.log(price, quantity)
    }


    return (
        <main>
            <p className={styles.name}>Event: {event}</p>
            
            <p className={styles.name}>Quantity: {eventData?.quantity}</p>
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
            <SetOrder minPrice={eventData?.minPrice} maxPrice={eventData?.maxPrice} handleSetOrder={handleSetOrder} />
        </main>
    )
}

export default Auth;