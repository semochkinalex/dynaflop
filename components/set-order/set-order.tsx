import { FormEventHandler, useContext, useState } from 'react';
import { UserContext } from '../../context/user-context';
import styles from './set-order.module.css';

const SetOrder = ({minPrice, maxPrice, onSubmit}) => {
    const [data, setData] = useState({})
    const [userData] = useContext(UserContext);

    const updateData = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (data.price > userData?.balance) {
            onSubmit(data.price);
        } else {
            console.log("Insufficient balance")
        }
    }
    
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input className={styles.input} onChange={updateData} name="price" type="number" min={minPrice} max={maxPrice} placeholder="Price" />
            {/* <input className={styles.input} onChange={updateData} name="quantity" type="number" placeholder="Quantity" /> */}
            <button type="submit" className={styles.submit}>Set limit order</button>
        </form>
    );
}

export default SetOrder;