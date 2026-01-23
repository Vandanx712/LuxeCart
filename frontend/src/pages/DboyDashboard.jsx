import { useState, useEffect } from "react";
import {
  FiShoppingBag,
  FiHome,
  FiPackage,
  FiSearch,
  FiEye,
  FiTruck,
  FiCheck,
  FiX,
  FiMenu,
  FiFilter,
  FiMail,
  FiUser,
  FiLogOut,
  FiCopy,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "../index.css";

function DboyDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setmenuitems] = useState([
    { icon: FiHome, label: "Dashboard" },
    { icon: FiShoppingBag, label: "Orders" },
  ]);
  const [activesection, setactivesection] = useState("Dashboard");
  const [totalorder, setTotalorder] = useState(0);
  const [totalorderPrice, setTotaloderPrice] = useState(0);
  const [shipped, setShipped] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [orders, setorder] = useState([]);
  const [recentorders, setRecentorders] = useState([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(0);
  const [password, setPassword] = useState("");
  const [hidebutton, setHideButton] = useState(true);
  const [orderDetail, setOrderDetail] = useState({});
  const [selectedOrder, setSelectedOrder] = useState("");

  const selectedoption = (label) => {
    setactivesection(label);
    setIsSidebarOpen(false);
  };

  const dboyId = localStorage.getItem("id");

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-gold/10 text-gold";
      case "Shipped":
        return "bg-royalpurple/10 text-royalpurple";
      case "Delivered":
        return "bg-emeraldgreen/10 text-emeraldgreen";
      default:
        return "bg-gold/10 text-gold";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <FiPackage className="text-sm" />;
      case "Shipped":
        return <FiTruck className="text-sm" />;
      case "Delivered":
        return <FiCheck className="text-sm" />;
      default:
        return <FiPackage className="text-sm" />;
    }
  };

  useEffect(() => {
    if (activesection == "Dashboard") {
      loadOrderlist();
      loadDboyDetail();
    }
    if (activesection == "Orders") {
      loadOrderlist();
    }
  }, [activesection]);

  useEffect(() => {
    loadOrderlist();
  }, [selectedOrder == ""]);

  const loadDboyDetail = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/deliveryboy/${dboyId}`,
        { withCredentials: true },
      );
      setUsername(response.data.deliveryBoy.username);
      setName(response.data.deliveryBoy.name);
      setEmail(response.data.deliveryBoy.email);
      setPhone(response.data.deliveryBoy.phone);
    } catch (error) {
      console.error(error);
    }
  };

  const loadOrderlist = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/deliveryboy/dashboard/orders`,
        { withCredentials: true },
      );
      setorder(response.data.orders);
      setDelivered(response.data.delivered);
      setShipped(response.data.shipped);
      setTotalorder(response.data.totalorder);
      setTotaloderPrice(response.data.totalamount);
      setRecentorders(response.data.orders.slice(0, 6));
    } catch (error) {
      console.error(error);
    }
  };

  const openOrder = async (orderid) => {
    setSelectedOrder(orderid);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/getorderbyid/${orderid}`,
        { withCredentials: true },
      );
      setOrderDetail(response.data.orderDetail);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/deliveryboy/updatestatus/${id}`,
        {},
        { withCredentials: true },
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      setSelectedOrder("");
    }
  };

  const updateDetail = async () => {
    const emailvalid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailvalid.test(email) === false) toast.error("Plz enter valid email");
    else {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/deliveryboy/updateprofile`,
          {
            name,
            email,
            newpassword:password,
            phone,
          },
          { withCredentials: true },
        );
        toast.success(response.data.message);
        setHideButton(true);
      } catch (error) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const renderContent = () => {
    switch (activesection) {
      case "Dashboard":
        return (
          <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-auto">
            {/* Welcome Section */}
            <div className="backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl bg-gradient-to-tl from-blue-600 to-blue-500 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-royalpurple/20 to-transparent"></div>
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-3">
                    Welcome back, {username}! 👋
                  </h1>
                  <p className="text-lg lg:text-xl opacity-90">
                    Here's what's happening with your store today.
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8">
              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-royalpurple/20 rounded-xl">
                    <FiTruck className="text-royalpurple text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">
                  Shipped
                </p>
                <p className="text-3xl font-bold text-CharcoalBlack">
                  {shipped}
                </p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-warmgrey/20 rounded-xl">
                    <FiCheck className="text-emeraldgreen text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">
                  Delivered
                </p>
                <p className="text-3xl font-bold text-CharcoalBlack">
                  {delivered}
                </p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl text-white">
                    <FiPackage className="text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-CharcoalBlack">
                  {totalorder}
                </p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gold/20 rounded-xl">
                    <FiPackage className="text-gold text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">
                  Total Delivered Amount
                </p>
                <p className="text-3xl font-bold text-CharcoalBlack">
                  ₹ {totalorderPrice}
                </p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-offwhite backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-royalpurple/30 transition-all duration-500 hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                <h3 className="text-xl lg:text-2xl font-semibold font-sans text-CharcoalBlack">
                  Recent Asigned Orders
                </h3>
                <button
                  onClick={() => setactivesection("Orders")}
                  className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 backdrop-blur-sm border border-warmgrey/20 text-CharcoalBlack hover:border-gold/50 text-sm lg:text-base"
                >
                  View All Orders
                </button>
              </div>

              <div className="space-y-3 lg:space-y-4">
                {recentorders.map((order) => (
                  <div
                    key={order.orderid}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 p-4 lg:p-6 hover:bg-offwhite rounded-xl lg:rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-royalpurple/20 group"
                  >
                    <div
                      className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl ${getOrderStatusColor(
                        order.status,
                      )} flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300 flex-shrink-0`}
                    >
                      {getStatusIcon(order.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mb-2">
                        <p className="font-bold text-CharcoalBlack text-base lg:text-lg">
                          {order.orderid}
                        </p>
                        <span
                          className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-bold ${getOrderStatusColor(
                            order.status,
                          )} shadow-sm inline-block w-fit`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-warmgrey font-medium text-sm lg:text-base">
                        {order.buyer} • {order.products}• {order.totalitem}{" "}
                        items
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2">
                      <p className="font-bold text-CharcoalBlack text-lg lg:text-xl">
                        ₹{order.totalprice}
                      </p>
                      <p className="text-warmgrey font-medium text-sm lg:text-base">
                        {order.time}
                      </p>
                    </div>

                    <button
                      onClick={() => openOrder(order.orderid)}
                      className="p-2 lg:p-3 hover:bg-gold/10 rounded-xl lg:rounded-2xl transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                    >
                      <FiEye className="text-warmgrey hover:text-gold transition-colors duration-300 text-lg lg:text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "Orders":
        return (
          <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-auto">
            {/* Header */}
            <div className="backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl bg-gradient-to-tl from-blue-600 to-blue-500  text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
                  <p className="text-lg opacity-90">
                    View and manage all your orders
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setFilterOpen(!isfilterOpen);
                      setItem("Order");
                    }}
                    className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-gradient-to-l from-sky-200 to-sky-200 text-CharcoalBlack hover:shadow-glow transform hover:-translate-y-1 flex items-center gap-2"
                  >
                    <FiFilter />
                    Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-royalpurple/20 rounded-xl">
                    <FiTruck className="text-royalpurple text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">
                  Shipped
                </p>
                <p className="text-3xl font-bold text-CharcoalBlack">
                  {shipped}
                </p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-warmgrey/20 rounded-xl">
                    <FiCheck className="text-emeraldgreen text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">
                  Delivered
                </p>
                <p className="text-3xl font-bold text-CharcoalBlack">
                  {delivered}
                </p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl text-white">
                    <FiPackage className="text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-CharcoalBlack">
                  {totalorder}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="bg-offwhite backdrop-blur-sm border border-gray-300 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-royalpurple/30 transition-all duration-500 hover:-translate-y-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warmgrey" />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer, or product..."
                  className="w-full pl-12 pr-6 py-4 bg-offwhite border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-royalpurple/50 focus:border-royalpurple/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-offwhite backdrop-blur-sm border border-gray-300 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-royalpurple/30 transition-all duration-500 hover:-translate-y-1">
              <h3 className="text-2xl font-semibold text-CharcoalBlack mb-6">
                All Orders
              </h3>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.orderid}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 p-6 hover:bg-offwhite-hover rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-royalpurple/20 group"
                  >
                    <div
                      className={`p-3 rounded-xl ${getOrderStatusColor(
                        order.status,
                      )} flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300`}
                    >
                      {getStatusIcon(order.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mb-2">
                        <p className="font-bold text-CharcoalBlack text-lg">
                          {order.orderid}
                        </p>
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-bold ${getOrderStatusColor(
                            order.status,
                          )} shadow-sm inline-block w-fit`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-warmgrey font-medium">
                        {order.buyer} • {order.products} • {order.totalitem}{" "}
                        items
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2">
                      <p className="font-semibold text-CharcoalBlack text-xl">
                        ₹{order.totalprice}
                      </p>
                      <p className="text-warmgrey font-medium text-sm">
                        {order.time}
                      </p>
                    </div>

                    <button
                      onClick={() => openOrder(order.orderid)}
                      className="p-3 hover:bg-gold/10 rounded-xl transition-all duration-300 group-hover:scale-110"
                    >
                      <FiEye className="text-warmgrey hover:text-gold transition-colors duration-300 text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-auto">
            {/* Header */}
            <div className="backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl bg-gradient-to-tl from-blue-600 to-blue-500  text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Profile Managment</h1>
                  <p className="text-lg opacity-90">
                    Manage your account and preferences
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Settings */}
              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-royalpurple/30 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-600 rounded-xl text-white">
                    <FiUser className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-CharcoalBlack">
                      Profile Settings
                    </h3>
                    <p className="text-warmgrey">
                      Manage your personal information
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-CharcoalBlack mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      Value={name}
                      onChange={(e) => {
                        setHideButton(false);
                        const newValue = e.target.value;
                        setName(newValue.trim().slice(0, 15));
                        setHideButton(newValue == seller.name);
                      }}
                      className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-CharcoalBlack mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      Value={email}
                      onChange={(e) => {
                        setHideButton(false);
                        const newValue = e.target.value;
                        setEmail(newValue.trim());
                        setHideButton(newValue == seller.email);
                      }}
                      className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-CharcoalBlack mb-2">
                      Phone(+91)
                    </label>
                    <input
                      type="text"
                      Value={phone}
                      onChange={(e) => {
                        setHideButton(false);
                        const onlyDigits = e.target.value.replace(/\D/g, "");
                        const limitedDigits = onlyDigits.slice(0, 10).trim();
                        setPhone(Number(limitedDigits));
                        setHideButton(limitedDigits == seller.phone);
                      }}
                      className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-CharcoalBlack mb-2">
                      New Password
                    </label>
                    <input
                      type="text"
                      Value={password}
                      onChange={(e) => {
                        setHideButton(false);
                        const newValue = e.target.value;
                        setPassword(newValue.trim().slice(0, 15));
                      }}
                      className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                    />
                  </div>
                  {!hidebutton && (
                    <button
                      className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-blue-600 text-white hover:shadow-glow transform hover:-translate-y-1 w-full"
                      onClick={() => updateDetail()}
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Settings */}
              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-royalpurple/30 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-600 rounded-xl text-white">
                    <FiMail className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-CharcoalBlack">
                      Contact & Support
                    </h3>
                    <p className="text-warmgrey">Get help and support</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full p-4 bg-offwhite hover:bg-warmgrey/10 rounded-xl transition-all text-left">
                    <p className="font-semibold text-CharcoalBlack">
                      Help Center
                    </p>
                    <p className="text-sm text-royalpurple">
                      Browse articles and guides
                    </p>
                  </button>
                  <button className="w-full p-4 bg-offwhite hover:bg-warmgrey/10 rounded-xl transition-all text-left">
                    <p className="font-semibold text-CharcoalBlack">
                      Contact Support
                    </p>
                    <p className="text-sm text-royalpurple">
                      Get in touch with our team
                    </p>
                  </button>
                  <button className="w-full p-4 bg-offwhite hover:bg-warmgrey/10 rounded-xl transition-all text-left">
                    <p className="font-semibold text-CharcoalBlack">
                      Feature Requests
                    </p>
                    <p className="text-sm text-royalpurple">
                      Suggest new features
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex relative">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
                fixed lg:relative lg:translate-x-0 w-72 h-screen flex flex-col z-50 transition-transform duration-300 ease-in-out
                ${
                  isSidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
                }
            `}
        >
          <div className="h-full m-4 overflow-hidden bg-CharcoalBlack rounded-2xl shadow-2xl backdrop-blur-md border border-white/20">
            {/* Close Button for Mobile */}
            <div className="lg:hidden absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-white/80 hover:text-white transition-colors duration-200"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gold rounded-2xl flex items-center justify-center shadow-lg">
                  <FiShoppingBag className="text-CharcoalBlack text-xl lg:text-2xl" />
                </div>
                <div>
                  <h1 className="text-[18px] text-pretty font-sans font-medium text-white">
                    {username}
                  </h1>
                  <p className="text-white/70 text-xs font-sans lg:text-sm">
                    {name}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 lg:p-6 space-y-2 ">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-offwhite hover:bg-white/10 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    activesection == item.label
                      ? "bg-gradient-to-r from-royalpurple/40 to-gold/30"
                      : ""
                  }`}
                  onClick={() => selectedoption(item.label)}
                >
                  <item.icon className="text-lg lg:text-xl" />
                  <span className="flex-1 font-medium text-sm lg:text-base">
                    {item.label}
                  </span>
                  {item.count && (
                    <span className="bg-gold text-CharcoalBlack text-xs px-2 lg:px-3 py-1 lg:py-1.5 rounded-full font-bold shadow-md">
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
              <Link
                to="/login"
                className=" flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-100/20 overflow-hidden cursor-pointer"
              >
                <FiLogOut className="text-lg lg:text-xl" />
                <span className="flex-1 font-medium text-sm lg:text-base">
                  LogOut
                </span>
              </Link>
            </nav>

            {/* User Profile */}
            <div className="p-4 lg:p-6 border-t border-white/10">
              <div
                className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer ${
                  activesection == "profile"
                    ? "bg-gradient-to-r from-royalpurple/40 to-gold/30"
                    : "bg-white/10"
                }`}
                onClick={() => selectedoption("profile")}
              >
                <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gold rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-CharcoalBlack font-bold text-sm lg:text-lg">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-pretty text-sm lg:text-base">
                    {name}
                  </p>
                  <p className="text-white/70 text-xs lg:text-sm">{username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mx-4 mt-2 lg:hidden p-2 hover:bg-white/50 rounded-xl transition-all duration-300 backdrop-blur-sm mr-4"
          >
            <FiMenu className="text-2xl text-CharcoalBlack" />
          </button>
          {renderContent()}
        </div>
      </div>
      {/* Order Details */}
      {selectedOrder && (
        <div
          className=" fixed inset-0 bg-CharcoalBlack/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-offwhite scrollbar rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold mb-1">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">
                  OrderId
                </label>
                <div className=" flex space-x-5">
                  <p className="text-lg font-medium text-CharcoalBlack">
                    {orderDetail.id}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(orderDetail.id);
                      toast.success("copied");
                    }}
                  >
                    <FiCopy />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">
                  Status
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${getOrderStatusColor(orderDetail.status)} flex items-center justify-center`}
                  >
                    {getStatusIcon(orderDetail.status)}
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getOrderStatusColor(orderDetail.status)}`}
                  >
                    {orderDetail.status}
                  </span>
                </div>
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">
                  Customer
                </label>
                <p className="text-lg font-medium text-CharcoalBlack">
                  {orderDetail.customer}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">
                  DeliveryBoy
                </label>
                <p className="text-lg font-medium text-CharcoalBlack">
                  {orderDetail?.deliveryboy
                    ? orderDetail.deliveryboy
                    : "Not assign"}
                </p>
              </div>
              {/* Product */}
              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">
                  Order items
                </label>
                {orderDetail &&
                  orderDetail.items &&
                  orderDetail.items.map((product) => (
                    <div className="flex items-center space-x-4 p-4 bg-offwhite rounded-lg">
                      <img
                        src={product?.image?.url}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-sans text-CharcoalBlack text-sm mb-1">
                          {product.name}
                        </h3>
                        <span className="font-sans text-sm text-center">
                          {product.variantname}
                        </span>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className=" text-warmgrey font-sans">
                              Quantity:
                            </h3>
                            <span className="font-Manrope text-sm w-8 text-center">
                              {product.quantity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <h3 className=" text-warmgrey font-sans">Price:</h3>
                            <span className="font-Manrope font-medium text-DeepNavy">
                              ₹
                              {(
                                product.discount_price * product.quantity
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">
                  Total Amount
                </label>
                <p className="text-lg font-medium text-CharcoalBlack">
                  {orderDetail.total_price}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">
                  Payment Status
                </label>
                <p className="text-lg font-medium text-CharcoalBlack">
                  {orderDetail.payment_status}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">
                  Shipping Address
                </label>
                <p className="text-lg font-medium text-CharcoalBlack">
                  {orderDetail.address}
                </p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">
                  Order Date
                </label>
                <p className="text-lg font-medium text-CharcoalBlack">
                  {orderDetail?.date ? orderDetail.date.split("T")[0] : "N/A"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex pt-4">
                <button
                  onClick={() => updateStatus(orderDetail.id)}
                  className={`${orderDetail.status == "Delivered" ? "hidden" : "flex"} px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300`}
                >
                  Order Delivered
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default DboyDashboard;
