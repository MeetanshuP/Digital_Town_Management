const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// PRODUCT SECTION //

// Seller: Add Product
exports.addProduct = async (req, res) => {
    try {
        const { title, price, category } = req.body;

        if (!req.user.roles.includes("seller")) {
            return res.status(403).json({ message: "Only sellers can add products" });
        }

        // Validate image file
        if (!req.file) {
            return res.status(400).json({ message: "Product image is required" });
        }

        // Upload image buffer to Cloudinary
        const uploadFromBuffer = () => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
        };

        const result = await uploadFromBuffer();

        // Create product with Cloudinary image
        const product = await Product.create({
            title,
            price,
            category,
            image: {
                url: result.secure_url,
                public_id: result.public_id,
            },
            seller: req.user._id,
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buyer: Get All Available Products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            isDeleted: false,
        })
            .populate("seller", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seller: Toggle Availability
exports.updateAvailability = async (req, res) => {
    try {
        const { productId } = req.params;
        const { availability } = req.body;

        const product = await Product.findOne({
            _id: productId,
            seller: req.user._id,
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.availability = availability;
        await product.save();

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CART SECTION //

// Add to Cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);

        if (!product || product.availability !== "available") {
            return res.status(400).json({ message: "Product not available" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;

                if (cart.items[itemIndex].quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                }
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product"
        );

        res.status(200).json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove From Cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ORDER SECTION //

// Place Order
exports.placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product"
        );

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Group items by seller
        const sellerMap = {};

        cart.items.forEach((item) => {
            const sellerId = item.product.seller.toString();

            if (!sellerMap[sellerId]) {
                sellerMap[sellerId] = [];
            }

            sellerMap[sellerId].push({
                product: item.product._id,
                quantity: item.quantity,
                priceAtPurchase: item.product.price,
            });
        });

        const createdOrders = [];

        for (const sellerId in sellerMap) {
            const order = await Order.create({
                buyer: req.user._id,
                seller: sellerId,
                items: sellerMap[sellerId],
            });

            createdOrders.push(order);
        }

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(createdOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buyer: Request Cancellation
exports.requestCancellation = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;

        const order = await Order.findOne({
            _id: orderId,
            buyer: req.user._id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "completed") {
            return res.status(400).json({ message: "Cannot cancel completed order" });
        }

        if (order.cancellationRequest === "requested") {
            return res.status(400).json({ message: "Already requested" });
        }

        order.cancellationRequest = "requested";
        order.cancellationReason = reason;

        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seller: Get All Orders
exports.getSellerOrders = async (req, res) => {
    try {
        if (!req.user.roles.includes("seller")) {
            return res.status(403).json({ message: "Only sellers can access this" });
        }

        const orders = await Order.find({
            seller: req.user._id,
        })
            .populate("buyer", "name email")
            .populate("items.product", "title price image")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Buyer: Get My Orders
exports.getBuyerOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            buyer: req.user._id,
        })
            .populate("seller", "name email")
            .populate("items.product");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seller: Accept Order
exports.acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            seller: req.user._id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== "placed") {
            return res.status(400).json({ message: "Order cannot be accepted" });
        }

        if (order.cancellationRequest === "requested") {
            return res.status(400).json({ message: "Resolve cancellation request first" });
        }

        order.status = "accepted";
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seller: Complete Order
exports.completeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            seller: req.user._id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== "accepted") {
            return res.status(400).json({ message: "Only accepted orders can be completed" });
        }

        order.status = "completed";
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seller: Cancel Order Directly
exports.cancelOrderBySeller = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            seller: req.user._id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "completed") {
            return res.status(400).json({ message: "Cannot cancel completed order" });
        }

        order.status = "cancelled_by_seller";
        order.cancellationRequest = "none";

        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seller: Approve Cancellation Request
exports.approveCancellation = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            seller: req.user._id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.cancellationRequest !== "requested") {
            return res.status(400).json({ message: "No cancellation request found" });
        }

        order.status = "cancelled_by_seller";
        order.cancellationRequest = "none";

        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seller: Reject Cancellation Request
exports.rejectCancellation = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            seller: req.user._id,
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.cancellationRequest !== "requested") {
            return res.status(400).json({ message: "No cancellation request found" });
        }

        order.cancellationRequest = "none";
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seller: Get My Products
exports.getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({
            seller: req.user._id,
            isDeleted: false,
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Seller: Soft Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findOne({
            _id: productId,
            seller: req.user._id,
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.isDeleted = true;
        await product.save();

        res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
