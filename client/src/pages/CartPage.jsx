import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import toast from "react-hot-toast";

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
        try {
            toast.loading("Placing order...", { id: "placeOrder" });

            await axios.post("/marketplace/orders");

            await fetchCart();
            await fetchProducts();

            toast.success("Order placed successfully!", { id: "placeOrder" });
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to place order",
                { id: "placeOrder" }
            );
        }
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
