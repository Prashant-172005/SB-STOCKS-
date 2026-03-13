const express = require("express");
const router = express.Router();
const { getAllUsers, getAllOrders, getAllTransactions, getStats, deleteUser } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect, adminOnly); // All admin routes require auth + admin role

router.get("/stats",           getStats);
router.get("/users",           getAllUsers);
router.delete("/users/:id",    deleteUser);
router.get("/orders",          getAllOrders);
router.get("/transactions",    getAllTransactions);

module.exports = router;
