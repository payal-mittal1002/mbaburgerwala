import { asyncError } from "../middlewares/errorMiddleWare.js"
import {Order} from "../models/Order.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import { instance } from "../server.js";
import crypto from "crypto"
import {Payment} from "../models/Payment.js"
export const placeOrder=asyncError(async(req,res,next)=>{
        const{
            shippingInfo,
            orderItems,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount,
        }=req.body;
        
        const user=req.user._id;
       
        const orderOptions={
            shippingInfo,
            orderItems,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount,
            user,
        };
        await Order.create(orderOptions);
        res.status(201).json({
            success:true,
            message:"Order Placed Successfully Via Cash On Delivery"
        });
        });



export const placeOrderOnline=asyncError(
    async(req,res,next)=>{
        const{
            shippingInfo,
            orderItems,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount,
        }=req.body
        
        const user=req.user._id;
       
        const orderOptions={
            shippingInfo,
            orderItems,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingCharges,
            totalAmount,
            user,
        };

        const options = {
            amount: Number(totalAmount)*100,  // amount in the smallest currency unit
            currency: "INR", 
            
          };
          const order=await instance.orders.create(options);


        
        res.status(201).json({
            success:true,
            order,
            orderOptions,
        });
        });


export const paymentVerification=(asyncError(async(req,res,next)=>{
const {razorpay_payment_id,razorpay_order_id,razorpay_signature,orderOptions}=req.body;
const body=razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature=crypto.createHmac("sha256",process.env.RAZORPAY_API_SECRET).update(body).digest("hex");
const isauthentic=razorpay_signature===expectedSignature;
if(isauthentic){
const payment=await Payment.create({
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    
})
await Order.create({
    ...orderOptions,
    paidAt:new Date(Date.now()),
    paymentInfo:payment._id,
})
res.status(201).json({
    success:true,
    message:`Order Placed Successfully . Payment Id:${paymant._id}`
})
}
else{
    return next(new ErrorHandler("Payment Failed",400));
}


}))




export const getMyOrders=asyncError(async(req,res,next)=>{
    const orders=await Order.find({
          user:req.user._id,
    }).populate("user","name");
    res.status(200).json({
        success:true,
        orders,
    });
});
export const getOrderDetails=asyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name");
    if(!order){
        return next(new ErrorHandler("invalid order id",404))
    }
    res.status(200).json({
        success:true,
        order,
    })
})


export const getAdminOrders=asyncError(async(req,res,next)=>{
    const orders=await Order.find({}).populate("user","name");
    res.status(200).json({
        success:true,
        orders,
    });
});
export const processOrder=asyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("invalid order id",404))
    }
    if(order.orderStatus==="Preparing")order.orderStatus="Shipped"
    else if(order.orderStatus==="Shipped"){
        order.orderStatus="Delivered"
        order.delivedredAt=new Date(Date.now());
    }
    else if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("Food Already Delivered",400))
    }
    order.save();
    res.status(200).json({
        success:true,
        message:"Status Updated Successfully"
       
    });
});