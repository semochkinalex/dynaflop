import { FormEventHandler, useState } from 'react';
import styles from './set-order.module.css';

const SetOrder = (minPrice: number, maxPrice: number, onSubmit: (a: number, b:number) => void) => {
    const [data, setData] = useState({})

    const updateData = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        onSubmit(data.price, data.quantity);
    }
    
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input className={styles.input} onChange={updateData} name="price" type="number" min={minPrice} max={maxPrice} placeholder="Price" />
            <input className={styles.input} onChange={updateData} name="quantity" type="number" min={minPrice} max={maxPrice} placeholder="Quantity" />
            <button type="submit" className={styles.submit}>Set limit order</button>
        </form>
    );
}

export default SetOrder;