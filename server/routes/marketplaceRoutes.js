const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { isSeller } = require("../middleware/rbacMiddleware");
const marketplaceController = require("../controllers/marketplaceController");
const protect = require("../middleware/authMiddleware");

// PRODUCT ROUTES //
// Add Product (Seller Only)
router.post(
    "/products",
    protect,
    upload.single("image"),
    marketplaceController.addProduct
);

// Get All Available Products
router.get(
    "/products",
    protect,
    marketplaceController.getProducts
);

// Update Product Availability (Seller Only)
router.patch(
    "/products/:productId/availability",
    protect,
    marketplaceController.updateAvailability
);

// CART ROUTES //
// Add To Cart
router.post(
    "/cart",
    protect,
    marketplaceController.addToCart
);

// Get Cart
router.get(
    "/cart",
    protect,
    marketplaceController.getCart
);

//Delete Item from Cart
router.delete(
    "/cart/:productId",
    protect,
    marketplaceController.removeFromCart
);

// ORDER ROUTES //
// Place Order
router.post(
    "/orders",
    protect,
    marketplaceController.placeOrder
);

// Buyer: Get My Orders
router.get(
    "/orders/my",
    protect,
    marketplaceController.getBuyerOrders
);

// Seller: Get Orders
router.get(
    "/orders/seller",
    protect,
    isSeller,
    marketplaceController.getSellerOrders
);

// Buyer: Request Cancellation
router.patch(
    "/orders/:orderId/request-cancel",
    protect,
    marketplaceController.requestCancellation
);

// Seller: Accept Order
router.patch(
    "/orders/:orderId/accept",
    protect,
    marketplaceController.acceptOrder
);

// Seller: Complete Order
router.patch(
    "/orders/:orderId/complete",
    protect,
    marketplaceController.completeOrder
);

// Seller: Cancel Order Directly
router.patch(
    "/orders/:orderId/cancel",
    protect,
    marketplaceController.cancelOrderBySeller
);

// Seller: Approve Cancellation Request
router.patch(
    "/orders/:orderId/approve-cancel",
    protect,
    marketplaceController.approveCancellation
);

// Seller: Reject Cancellation Request
router.patch(
    "/orders/:orderId/reject-cancel",
    protect,
    marketplaceController.rejectCancellation
);

// Seller Product Management
router.get(
    "/seller/products",
    protect,
    isSeller,
    marketplaceController.getMyProducts
);

router.delete(
    "/products/:productId",
    protect,
    isSeller,
    marketplaceController.deleteProduct
);
module.exports = router;
