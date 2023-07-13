import Link from 'next/link';
import { FC } from 'react';
import styles from './event.module.css';

interface IEvent {
    name: string;
    currentPrice: number;
    quantity: number;
    available: number;
}

const Event: FC<IEvent> = ({name, currentPrice, quantity, available}) => {
    return (
        <Link href={`/events/${name}`}>
            <li className={styles.event}>
                <p className={`${styles.name} ${styles.text}`}>{name}</p>

                <p className={`${styles.text} ${styles.price}`}>{available}/{quantity}</p>

                <p className={`${styles.text} ${styles.price}`}>${currentPrice}</p>

            </li>
        </Link>
    );
}

export default Event;