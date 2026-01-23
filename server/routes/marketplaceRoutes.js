const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
} = require("../controllers/marketplaceController");

router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", authMiddleware, createItem);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);

module.exports = router;
