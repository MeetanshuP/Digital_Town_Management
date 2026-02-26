import { useEffect, useState, useMemo } from "react";
import axios from "../utils/axiosInstance";
import ProductCard from "../components/ProductCard";

const MarketplaceHome = () => {
    const [products, setProducts] = useState([]);
    const [cartMap, setCartMap] = useState({});

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get("/marketplace/products");
            setProducts(res.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const fetchCart = async () => {
        try {
            const res = await axios.get("/marketplace/cart");

            const map = {};
            res.data.items?.forEach(item => {
                const productId =
                    typeof item.product === "object"
                        ? item.product._id
                        : item.product;

                map[productId] = item.quantity;
            });

            setCartMap(map);
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const increaseQuantity = async (productId) => {
        try {
            await axios.post("/marketplace/cart", {
                productId,
                quantity: 1,
            });
            fetchCart();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const decreaseQuantity = async (productId, currentQty) => {
        try {
            if (currentQty <= 1) {
                await axios.delete(`/marketplace/cart/${productId}`);
            } else {
                await axios.post("/marketplace/cart", {
                    productId,
                    quantity: -1,
                });
            }
            fetchCart();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    const placeOrder = async () => {
        try {
            await axios.post("/marketplace/orders");
            await fetchCart();
            await fetchProducts();
            alert("Order placed successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to place order");
        }
    };

    // 🔹 Derived cart data
    const cartItems = useMemo(() => {
        return products.filter(p => cartMap[p._id] > 0);
    }, [products, cartMap]);

    const subtotal = useMemo(() => {
        return cartItems.reduce(
            (sum, product) =>
                sum + product.price * cartMap[product._id],
            0
        );
    }, [cartItems, cartMap]);

    const totalItems = useMemo(() => {
        return Object.values(cartMap).reduce((a, b) => a + b, 0);
    }, [cartMap]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-8">Marketplace</h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* LEFT: Products */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            quantity={cartMap[product._id] || 0}
                            onIncrease={() => increaseQuantity(product._id)}
                            onDecrease={() =>
                                decreaseQuantity(product._id, cartMap[product._id] || 0)
                            }
                        />
                    ))}
                </div>

                {/* RIGHT: Sticky Cart */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white shadow rounded-xl p-6">

                        <h3 className="text-lg font-semibold mb-4">
                            Cart Summary
                        </h3>

                        {cartItems.length === 0 ? (
                            <p className="text-gray-500">
                                Your cart is empty.
                            </p>
                        ) : (
                            <>
                                <div className="space-y-3 mb-4">
                                    {cartItems.map(product => (
                                        <div
                                            key={product._id}
                                            className="flex justify-between text-sm"
                                        >
                                            <span>
                                                {product.title} × {cartMap[product._id]}
                                            </span>
                                            <span>
                                                ₹
                                                {product.price *
                                                    cartMap[product._id]}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Items</span>
                                        <span>{totalItems}</span>
                                    </div>

                                    <div className="flex justify-between font-semibold text-base">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal}</span>
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        Payment: Cash on Delivery
                                    </div>
                                </div>

                                <button
                                    onClick={placeOrder}
                                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                                >
                                    Place Order
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketplaceHome;