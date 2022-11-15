import Link from 'next/link';
import { FC } from 'react';
import styles from './event.module.css';

interface IEvent {
    name: string;
    currentPrice: number;
}

const Event: FC<IEvent> = ({name, currentPrice}) => {
    return (
        <li className={styles.event}>
            <p className={`${styles.name} ${styles.text}`}>{name}</p>
            
            <p className={`${styles.text} ${styles.price}`}>Price: {currentPrice} ₽</p>
            
            <Link href={`/events/${name}`}><button className={styles.visit}>Visit</button></Link>
        </li>
    );
}

export default Event;