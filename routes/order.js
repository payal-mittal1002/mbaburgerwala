import express from "express";
import { isAuthenticated,authorizedAdmin } from "../middlewares/auth.js";
import { getAdminOrders, getMyOrders, getOrderDetails, paymentVerification, placeOrder, placeOrderOnline, processOrder } from "../controllers/order.js";
const router=express.Router();

router.post("/createorder",isAuthenticated,placeOrder)
router.post("/createorderonline",isAuthenticated,placeOrderOnline);
router.post("/paymentverification",isAuthenticated,paymentVerification);
router.get("/myorders",isAuthenticated,getMyOrders);
router.get("/order/:id",isAuthenticated,getOrderDetails);

// add admin middleware
router.get("/admin/orders",isAuthenticated,authorizedAdmin,getAdminOrders);
router.get("/admin/order/:id",isAuthenticated,authorizedAdmin,processOrder);
export default router;