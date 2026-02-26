import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const CartPage = () => {
    const [cart, setCart] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const res = await axios.get("/marketplace/cart");
        setCart(res.data);
    };

    const placeOrder = async () => {
        await axios.post("/marketplace/orders");
        alert("Order placed");
        fetchCart();
    };

    return (
        <div>
            <h2>My Cart</h2>
            {cart?.items?.map((item) => (
                <div key={item.product._id}>
                    {item.product.title} - {item.quantity}
                </div>
            ))}
            <button onClick={placeOrder}>Place Order</button>
        </div>
    );
};

export default CartPage;
