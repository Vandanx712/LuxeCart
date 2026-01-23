import { Buyer } from "../models/buyer/buyer.model.js";
import { Order } from "../models/order/order.model.js";
import { Product } from "../models/product/product.model.js";
import { DeliveryBoy } from "../models/seller/deliveryboy.model.js";
import { ApiError } from "../utill/apierror.js";
import { asynchandller } from "../utill/asynchandller.js";
import bcrypt from "bcrypt";
import { findUserByEmail } from "./common.controller.js";
import { Payment } from "../models/order/payment.model.js";

export const getDeliveryboyById = asynchandller(async (req, res) => {
  const { deliveryboyId } = req.params;
  if (!deliveryboyId) throw new ApiError(429, "Plz pass deliveryBoy id");

  const deliveryBoy =
    await DeliveryBoy.findById(deliveryboyId).select("-password");
  if (!deliveryBoy) throw new ApiError(404, "DeliveryBoy not found");

  return res.status(200).json({
    message: "Fetch deliveryBoy detail successfully",
    deliveryBoy,
  });
});

export const updateBoyProfile = asynchandller(async (req, res) => {
  const { name, email, newpassword, phone } = req.body;
  const boyId = req.user.id;

  const existBoy = await DeliveryBoy.findOne({
    $or: [{ email, phone }],
  }).select("-password");
  const user = await findUserByEmail(email);

  if (existBoy) {
    if (existBoy.email === email && existBoy.id !== boyId)
      throw new ApiError(400, "Email already exist");
    if (existBoy.phone === phone && existBoy.id !== boyId)
      throw new ApiError(400, "PhoneNO already exist");
  }

  if (user.id !== boyId) throw new ApiError(400, "Email already exist");

  const updatedBoy = await DeliveryBoy.findByIdAndUpdate(
    boyId,
    {
      name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(newpassword, 10),
      phone,
    },
    { new: true },
  );
  if (!updatedBoy) throw new ApiError(404, "DeliveryBoy not found");

  return res.status(200).json({
    message: "Deliveryboy profile update successfully",
    updatedBoy,
  });
});
// Order part

export const getOrderByStatus = asynchandller(async (req, res) => {
  const deliveryboyId = req.user.id;
  const { order_status } = req.body;

  const deliveryboyOrders = await Order.find({
    delivery_boy: deliveryboyId,
    order_status: order_status,
  }).sort({ createdAt: -1 });
  const totalOrder = deliveryboyOrders.length;

  return res.status(200).json({
    message: "Fetch all order by status successfully",
    deliveryboyOrders,
    totalOrder,
  });
});

export const updateOrderstatus = asynchandller(async (req, res) => {
  const { orderId } = req.params;
  if (!orderId) throw new ApiError(400, "Order id must be required");

  const order = await Order.findByIdAndUpdate(
    orderId,
    { order_status: "Delivered" , payment_status:'Completed'},
    { new: true },
  );
  if (!order) throw new ApiError(404, "Order not found with given id");
  await Payment.findOneAndUpdate({order:order.id},{$set:{payment_status:'Completed'}})

  return res.status(200).json({
    message: "Order status update successfully",
    order,
  });
});

//daashboard part

export const getOrders = asynchandller(async (req, res) => {
  const { id } = req.user;
  const dborders = await Order.find({ delivery_boy: id })
    .select("buyer seller items total_price order_status createdAt")
    .sort({ createdAt: -1 });
    
  const orders = await Promise.all(
    dborders.map(async (order) => {
      const buyername = await Buyer.findById(order.buyer).select("name");
      const product = await Product.findById(order.items[0].product).select(
        "name",
      );
      const productname =
        order.items.length > 1 ? product.name + " & more" : product.name;

      let time = "just Now";

      const ordertime = new Date(order.createdAt);
      const nowtime = new Date();
      const diffMs = nowtime - ordertime;
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes > 0)
        time = `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
      if (diffHours > 0)
        time = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays > 0) time = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

      return {
        orderid: order.id,
        seller: order.seller,
        buyer: buyername.name,
        products: productname,
        totalitem: order.items.length,
        totalprice: order.total_price,
        status: order.order_status,
        time,
      };
    }),
  );
  const totalorder = orders.length;
  const totalamount = orders.reduce((sum, order) => order.status == "Delivered" ? sum + order.totalprice:0, 0);
  const shipped = orders.filter((order) => order.status == "Shipped").length;
  const delivered = orders.filter(
    (order) => order.status == "Delivered",
  ).length;

  return res.status(200).json({
    message: "Order list fetch successfully",
    totalorder,
    totalamount,
    shipped,
    delivered,
    orders,
  });
});