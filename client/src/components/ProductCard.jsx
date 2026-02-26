const ProductCard = ({ product, quantity, onIncrease, onDecrease }) => {
    const isOutOfStock = product.availability === "out_of_stock";

    return (
        <div
            className={`rounded-xl shadow p-4 transition ${isOutOfStock
                    ? "bg-gray-100 opacity-70"
                    : "bg-white hover:shadow-lg"
                }`}
        >
            <img
                src={product.image?.url}
                alt={product.title}
                className="h-40 w-full object-cover rounded mb-4"
            />

            <h3 className="font-semibold text-lg">{product.title}</h3>

            <p className="text-gray-600 mb-4">₹{product.price}</p>

            {isOutOfStock ? (
                <div className="mt-2">
                    <span className="text-red-600 font-semibold">
                        Out of Stock
                    </span>
                </div>
            ) : quantity > 0 ? (
                <div className="flex items-center gap-4">
                    <button
                        onClick={onDecrease}
                        className="bg-gray-200 px-3 py-1 rounded text-lg font-bold"
                    >
                        -
                    </button>

                    <span className="font-semibold text-lg">
                        {quantity}
                    </span>

                    <button
                        onClick={onIncrease}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-lg font-bold"
                    >
                        +
                    </button>
                </div>
            ) : (
                <button
                    onClick={onIncrease}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                    Add to Cart
                </button>
            )}
        </div>
    );
};

export default ProductCard;