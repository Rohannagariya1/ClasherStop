const Order = require("../models/orderModel");
const Product = require("../models/productModel");
//create product
const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError"); 
// create new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const { orderItems, paymentInfo, itemsPrice, taxPrice, totalPrice, } = req.body;
    const order = await Order.create({
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });
    res.status(201).json({
        success: true,
        order,
    });
});
//get  single order 
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new ErrorHander("Order not found with this id", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });


});
//get logged in user order 
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders,
    });


});
// get all order , this is the admin path in this we will get the total value of the orders as well
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });


});


//update order this will also be the admin route 
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHander("Order not found with this id", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHander("You have already delivered this order", 400));
    }


        order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
    })
   
    order.orderStatus = req.body.status;
    if (req.body.status == 'Delivered') {
        order.deliveredAt = Date.now();
        
     
    }


    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        order,
    });


});
//this function is for updating stock used as a helper function for the above function
async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHander("Order not found with this id", 404));
    }
    await Order.deleteOne({ _id: orderId });

    res.status(200).json({
        success: true,
        
    })
})