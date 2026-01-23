import { useState, useEffect } from 'react'
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiHome,
  FiPackage,
  FiSearch,
  FiPlus,
  FiEye,
  FiTruck,
  FiCheck,
  FiX,
  FiMenu,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiUser,
  FiLock,
  FiLogOut,
  FiCopy
} from 'react-icons/fi'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { toast,Toaster } from 'react-hot-toast';
import '../index.css'
import AddProduct from '../components/common/AddProduct';
import UpdateProduct from '../components/common/UpdateProduct';



function SellerDashboard() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setmenuitems] = useState([
    { icon: FiHome, label: 'Dashboard' },
    { icon: FiShoppingBag, label: 'Orders' },
    { icon: FiPackage, label: 'Products' },
    { icon: FiUsers, label: 'Deliveryboys' }
  ])
  const [activesection, setactivesection] = useState('Dashboard')
  const [totalorder,setTotalorder] = useState(0)
  const [processing,setProcessing] = useState(0)
  const [shipped,setShipped] = useState(0)
  const [delivered,setDelivered] = useState(0)
  const [totalproduct,setTotalproduct] = useState(0)
  const [instock,setInstock] = useState(0)
  const [lowstock,setLowstock] = useState(0)
  const [outstock,setOutstock] = useState(0)
  const [totaldeliveryboy,setTotaldeliveryboy] = useState(0)
  const [free,setFree] = useState(0)
  const [ondelivery,setOndelivery] = useState(0)
  const [orders,setorder] = useState([])
  const [products,setProducts] = useState([])
  const [deliveyboys,setDeliveryboy] = useState([])
  const [recentorders,setRecentorders] = useState([])
  const [name,setName] = useState('')
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [phone,setPhone] = useState(0)
  const [shopname,setShopname] = useState('')
  const [hidebutton,setHideButton] = useState(true)
  const [seller,setSeller] = useState({})
  const [isfilterOpen,setFilterOpen] = useState(false)
  const [item,setItem] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState('');
  const [secSelectedStatus, setSecSeletedStatus] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [deliveredOrder, setDeliveredOrder] = useState('all')
  const [dateRange, setDateRange] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [statuses, setStatuses] = useState([])
  const [categories, setCategories] = useState([])
  const [discount, setDiscount] = useState('all')
  const [selectedOrder,setSelectedOrder] = useState('')
  const [selectedProduct,setSelectedProduct] = useState('')
  const [selectedDeliveryboy,setSelectedDeliveryboy] = useState('')
  const [isAssignopen,setAssignOpen] = useState(false)
  const [isAddProductOpen,setAddProductopen] = useState(false)
  const [orderId,setOrderid] = useState('')
  const [orderDetail,setOrderDetail] = useState({})


  const sellerId = localStorage.getItem('id')

  const selectedoption = (label) => {
    setactivesection(label)
    setIsSidebarOpen(false)
  }

  useEffect(()=>{
    if(activesection=='Dashboard') {loadOrderlist(); loadSellerDetail()}
    if(activesection=='Orders') {loadOrderlist()}
    if(activesection=='Products') {loadProductlist()}
    if(activesection=='Deliveryboys') {loadDeliveryboylist()}
  },[activesection])
  
  useEffect(() => {
    if (item === 'Order' && statuses !== forOrder) {
      setStatuses(forOrder);
    } else if (item === 'Product' && statuses !== forProduct) {
      setStatuses(forProduct);
      loadCategory();
    } else if (item === 'Deliveryboy' && statuses !== forboy) {
      setStatuses(forboy);
    }
  },[item])

  const loadOrderlist = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/getorderlist`,{withCredentials:true})
      setorder(response.data.orders)
      setTotalorder(response.data.totalorder)
      setProcessing(response.data.processing)
      setShipped(response.data.shipped)
      setDelivered(response.data.delivered)
      setRecentorders(response.data.orders.slice(0,6))
    } catch (error) {
      console.log(error)
    }
  }

  const loadProductlist = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/getproductlist`,{withCredentials:true})
      setProducts(response.data.products)
      setTotalproduct(response.data.totalproduct)
      setInstock(response.data.instock)
      setLowstock(response.data.lowstock)
      setOutstock(response.data.outofstock)
    } catch (error) {
      console.log(error)
    }
  }

  const loadDeliveryboylist = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/getdeliveryboylist`,{withCredentials:true})
      setDeliveryboy(response.data.deliveryboys)
      setTotaldeliveryboy(response.data.totaldeliveryboy)
      setFree(response.data.free)
      setOndelivery(response.data.ondelivery)
    } catch (error) {
      console.log(error)
    }
  }

  const loadSellerDetail=async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/getdetail/${sellerId}`,{withCredentials:true})
      setSeller(response.data.seller)
      setUsername(response.data.seller.username)
      setName(response.data.seller.name)
      setEmail(response.data.seller.email)
      setPhone(response.data.seller.phone)
      setShopname(response.data.seller.shopname)
    } catch (error) {
      console.log(error)
    }
  }

  const updateDetail = async () => {
    const emailvalid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailvalid.test(email) === false) toast.error('Plz enter valid email')
    else {
      try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller/update`, {
          username,
          name,
          email,
          phone,
          shopname
        }, { withCredentials: true })
        toast.success(response.data.message)
        setSeller(response.data.updatedSeller)
        setHideButton(true)
      } catch (error) {
        toast.error(error.response?.data.message)
        console.log(error)
      }
    }
  }

  const handleReset = () => {
    setSelectedStatuses('');
    setSecSeletedStatus('');
    setVehicle('')
    setDeliveredOrder('all')
    setDiscount('all')
    setDateRange('all');
    setPriceRange('all');
  };

  const loadCategory = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/allcategory`)
      setCategories(response.data.categoies)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFilter = async()=>{
    try {
      if(item=='Order'){
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller/getfilteredlist`,{
          item,
          status:selectedStatuses,
          range:dateRange,
          range2:priceRange
        },{withCredentials:true})
        setorder(response.data.filteredItem)
      }
      if(item=='Product'){
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller/getfilteredlist`,{
          item,
          status:selectedStatuses,
          status2:secSelectedStatus,
          range:discount,
          range2:priceRange
        },{withCredentials:true})
        setProducts(response.data.filteredItem)
      }
      if(item=='Deliveryboy'){
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/seller/getfilteredlist`,{
          item,
          status:selectedStatuses,
          status2:vehicle,
          range:deliveredOrder
        },{withCredentials:true})
        setDeliveryboy(response.data.filteredItem)
      }
        setFilterOpen(!isfilterOpen)
        handleReset()
    } catch (error) { 
      console.error(error)
    }
  }

  const AssignOrder = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/seller/assignorder`, {
        deliveryboyId: selectedDeliveryboy,
        orderId
      }, { withCredentials: true })
      toast.success(response.data.message)
      setAssignOpen(!isAssignopen)
      selectedDeliveryboy('')
      setOrderid('')
    } catch (error) {
      toast.error(error.response?.data.message)
    }
  }

  const openOrder = async(orderid)=>{
    setSelectedOrder(orderid)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/seller/getorderbyid/${orderid}`,{withCredentials:true})
      setOrderDetail(response.data.orderDetail)
    } catch (error) {
      console.log(error)
    }
  }

  const closeAddProduct = ()=>{
    setAddProductopen(!isAddProductOpen)
  }

  const forOrder = [
    { id: 'Processing', label: 'Processing', color: 'bg-gold/10 text-gold' },
    { id: 'shipped', label: 'Shipped', color: 'bg-royalpurple/20 text-royalpurple' },
    { id: 'delivered', label: 'Delivered', color: 'bg-emeraldgreen/10 text-emeraldgreen' },
  ];

  const forProduct = [
    { id: 'instock', label: 'In Stock', color: 'bg-emeraldgreen/10 text-emeraldgreen' },
    { id: 'lowstock', label: 'Low Stock', color: 'bg-gold/10 text-gold' },
    { id: 'outofstock', label: 'Out of Stock', color: 'bg-red-200 text-red-500' }
  ]

  const DiscountforProduct = [
    { id: 'all', label: 'All Discount' },
    { id: '0<15', label: 'Under 15%' },
    { id: '15<30', label: '15% - 30%' },
    { id: '>30', label: 'Over 30%' },
  ]

  const forboy = [
    { id: 'true', label: 'On Delivery', color: 'bg-gold/10 text-gold' },
    { id: 'false', label: 'Free', color: 'bg-emeraldgreen/10 text-emeraldgreen' }
  ]

  const vehicleforboy = [
    { id: 'bike', label: 'Bike' },
    { id: 'tempo', label: 'Tempo' },
    { id: 'van', label: 'Van' },
    { id: 'truck', label: 'Truck' }
  ]

  const deliveredorder = [
    { id: 'all', label: 'All Orders' },
    { id: '0<5', label: 'Under 5' },
    { id: '5<10', label: '5 - 10' },
    { id: '10<20', label: '10 - 20' },
    { id: '>20', label: 'Over 20' },
  ];

  const itemRanges = [
    { id: 'all', label: 'All Items' },
    { id: '1', label: '1' },
    { id: '2', label: '2' },
    { id: '>2', label: 'Over 2' }
  ];

  const priceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: '0<500', label: 'Under ₹500' },
    { id: '500<1000', label: '₹500 - ₹1000' },
    { id: '1000<2000', label: '₹1000 - ₹2000' },
    { id: '>2000', label: 'Over ₹2000' },
  ];

  // Metrics data
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$124,563',
      change: '+12.5% from last month',
      changeType: 'positive',
      icon: <FiDollarSign className="text-xl" />,
      trend: <FiArrowUp className="text-emerald-green" />
    },
    {
      title: 'Orders',
      value: '1,247',
      change: '+8.2% from last month',
      changeType: 'positive',
      icon: <FiShoppingBag className="text-xl" />,
      trend: <FiArrowUp className="text-emerald-green" />
    },
    {
      title: 'Customers',
      value: '847',
      change: '+15.3% from last month',
      changeType: 'positive',
      icon: <FiUsers className="text-xl" />,
      trend: <FiArrowUp className="text-emerald-green" />
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-2.1% from last month',
      changeType: 'negative',
      icon: <FiTrendingUp className="text-xl" />,
      trend: <FiArrowDown className="text-danger" />
    }
  ];

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-emeraldgreen';
      case 'negative':
        return 'text-red-500';
      case 'neutral':
        return 'text-warmgrey';
      default:
        return 'text-warmgrey';
    }
  };

  const getOrderStatusColor = (status)=>{
    switch(status){
      case 'Processing':
        return 'bg-gold/10 text-gold';
      case 'Shipped':
        return 'bg-royalpurple/10 text-royalpurple';
      case 'Delivered':
        return 'bg-emeraldgreen/10 text-emeraldgreen';
      default:
        return 'bg-gold/10 text-gold';
    }
  }

  const getProductStatusColor = (stock)=>{
      if(stock>=5) return {color:'bg-emeraldgreen/10 text-emeraldgreen',status:'In Stock'};
      else if(stock<5) return {color:'bg-gold/20 text-gold',status:'Low Stock'};
      else if(stock==0) return {color:'bg-red-200 text-red-500',status:'Out of Stock'};
  }

  const getBoyStatusColor=(status)=>{
    if(status==true) return {color:'bg-gold text-CharcoalBlack',Status:'On Delivery'}
    else if(status==false) return {color:'bg-emeraldgreen/10 text-emeraldgreen',Status:'Free'}
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing':
        return <FiPackage className="text-sm" />;
      case 'Shipped':
        return <FiTruck className="text-sm" />;
      case 'Delivered':
        return <FiCheck className="text-sm" />;
      default:
        return <FiPackage className="text-sm" />;
    }
  };

  const renderContent = () => {
    switch (activesection) {
      case 'Dashboard':
        return (
          <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-auto">
            {/* Welcome Section */}
            <div className="backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl bg-gradient-to-tl from-blue-600 to-blue-500 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-royalpurple/20 to-transparent"></div>
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-3">Welcome back, {username}! 👋</h1>
                  <p className="text-lg lg:text-xl opacity-90">Here's what's happening with your store today.</p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-8">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-offwhite backdrop-blur-sm border border-offwhite/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden group">
                  <div className="flex items-start justify-between mb-4 lg:mb-6">
                    <div className="p-3 lg:p-4 bg-blue-600 rounded-xl lg:rounded-2xl text-white group-hover:shadow-glow transition-all duration-500 group-hover:scale-110">
                      {metric.icon}
                    </div>
                    {metric.trend && (
                      <div className="text-warmgrey group-hover:text-royalpurple transition-colors duration-300">
                        {metric.trend}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs lg:text-sm text-warmgrey font-sans font-medium uppercase tracking-wide">{metric.title}</p>
                    <p className="text-2xl lg:text-3xl font-semibold text-CharcoalBlack group-hover:text-royalpurple transition-colors duration-300">{metric.value}</p>
                    <p className={`text-xs lg:text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                      {metric.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-offwhite backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-royalpurple/30 transition-all duration-500 hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                <h3 className="text-xl lg:text-2xl font-semibold font-sans text-CharcoalBlack">Recent Orders</h3>
                <button onClick={()=>setactivesection('Orders')} className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 backdrop-blur-sm border border-warmgrey/20 text-CharcoalBlack hover:border-gold/50 text-sm lg:text-base">View All Orders</button>
              </div>

              <div className="space-y-3 lg:space-y-4">
                {recentorders.map((order) => (
                  <div
                    key={order.orderid}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 p-4 lg:p-6 hover:bg-offwhite rounded-xl lg:rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-royalpurple/20 group"
                  >
                    <div className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl ${getOrderStatusColor(order.status)} flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300 flex-shrink-0`}>
                      {getStatusIcon(order.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mb-2">
                        <p className="font-bold text-CharcoalBlack text-base lg:text-lg">{order.orderid}</p>
                        <span className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-bold ${getOrderStatusColor(order.status)} shadow-sm inline-block w-fit`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-warmgrey font-medium text-sm lg:text-base">{order.buyer} • {order.products}• {order.totalitem} items</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2">
                      <p className="font-bold text-CharcoalBlack text-lg lg:text-xl">₹{order.totalprice}</p>
                      <p className="text-warmgrey font-medium text-sm lg:text-base">{order.time}</p>
                    </div>

                    <button onClick={()=>openOrder(order.orderid)} className="p-2 lg:p-3 hover:bg-gold/10 rounded-xl lg:rounded-2xl transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                      <FiEye className="text-warmgrey hover:text-gold transition-colors duration-300 text-lg lg:text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Orders':
        return (
          <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-auto">
            {/* Header */}
            <div className="backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl bg-gradient-to-tl from-blue-600 to-blue-500  text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
                  <p className="text-lg opacity-90">View and manage all your orders</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={()=>{setFilterOpen(!isfilterOpen);setItem('Order')}} className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-gradient-to-l from-sky-200 to-sky-200 text-CharcoalBlack hover:shadow-glow transform hover:-translate-y-1 flex items-center gap-2">
                    <FiFilter />
                    Filter
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gold/20 rounded-xl">
                    <FiPackage className="text-gold text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">Processing</p>
                <p className="text-3xl font-bold text-CharcoalBlack">{processing}</p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-royalpurple/20 rounded-xl">
                    <FiTruck className="text-royalpurple text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">Shipped</p>
                <p className="text-3xl font-bold text-CharcoalBlack">{shipped}</p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-warmgrey/20 rounded-xl">
                    <FiCheck className="text-emeraldgreen text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">Delivered</p>
                <p className="text-3xl font-bold text-CharcoalBlack">{delivered}</p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl text-white">
                    <FiPackage className="text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-CharcoalBlack">{totalorder}</p>
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
              <h3 className="text-2xl font-semibold text-CharcoalBlack mb-6">All Orders</h3>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.orderid}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 p-6 hover:bg-offwhite-hover rounded-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-royalpurple/20 group"
                  >
                    <div className={`p-3 rounded-xl ${getOrderStatusColor(order.status)} flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300`}>
                      {getStatusIcon(order.status)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mb-2">
                        <p className="font-bold text-CharcoalBlack text-lg">{order.orderid}</p>
                        <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getOrderStatusColor(order.status)} shadow-sm inline-block w-fit`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-warmgrey font-medium">{order.buyer} • {order.products} • {order.totalitem} items</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2">
                      <p className="font-semibold text-CharcoalBlack text-xl">₹{order.totalprice}</p>
                      <p className="text-warmgrey font-medium text-sm">{order.time}</p>
                    </div>

                    <button onClick={()=>openOrder(order.orderid)} className="p-3 hover:bg-gold/10 rounded-xl transition-all duration-300 group-hover:scale-110">
                      <FiEye className="text-warmgrey hover:text-gold transition-colors duration-300 text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Products':
        return (
          <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-auto">
            {/* Header */}
            <div className="backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl bg-gradient-to-tl from-blue-600 to-blue-500  text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Products Management</h1>
                  <p className="text-lg opacity-90">Manage your product inventory</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={()=>{setFilterOpen(!isfilterOpen);setItem('Product')}} className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-gradient-to-l from-sky-200 to-sky-200 text-CharcoalBlack hover:shadow-glow transform hover:-translate-y-1 flex items-center gap-2">
                    <FiFilter />
                    Filter
                  </button>
                  <button onClick={()=>setAddProductopen(!isAddProductOpen)} className=" px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-gradient-to-l from-yellow-500 to-yellow-400 text-CharcoalBlack hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-2">
                    <FiPlus />
                    Add Product
                  </button>
                </div>  
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emeraldgreen/20 rounded-xl">
                    <FiPackage className="text-emeraldgreen text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">In Stock</p>
                <p className="text-3xl font-bold text-CharcoalBlack">{instock}</p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gold/20 rounded-xl">
                    <FiPackage className="text-gold text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-CharcoalBlack">{lowstock}</p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-200 rounded-xl">
                    <FiPackage className="text-red-500 text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">Out of Stock</p>
                <p className="text-3xl font-bold text-CharcoalBlack">{outstock}</p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl text-white">
                    <FiPackage className="text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">Total Products </p>
                <p className="text-3xl font-bold text-CharcoalBlack">{totalproduct}</p>
              </div>
            </div>

            {/* Search */}
            <div className="bg-offwhite backdrop-blur-sm border border-gray-300 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-royalpurple/30 transition-all duration-500 hover:-translate-y-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warmgrey" />
                <input
                  type="text"
                  placeholder="Search orders by name, category, or Id..."
                  className="w-full pl-12 pr-6 py-4 bg-offwhite border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-royalpurple/50 focus:border-royalpurple/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Products List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.productId}
                  className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group hover:border-royalpurple/20 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl text-white group-hover:scale-110 transition-all duration-300">
                      <FiPackage className="text-xl" />
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getProductStatusColor(product.totalstock).color}`}>
                      {getProductStatusColor(product.totalstock).status}
                    </span>
                  </div>

                  <h3 className="text-xl h-13 font-medium font-sans text-CharcoalBlack mb-4 group-hover:text-royalpurple transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-warmgrey mb-4">{product.procategory}</p>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-warmgrey mb-1">Price</p>
                      <p className="text-2xl font-semibold font-Playfair text-CharcoalBlack">₹{product.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-warmgrey mb-1">Discount</p>
                      <p className="text-2xl font-semibold font-Playfair text-CharcoalBlack">{product.discount}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-warmgrey mb-1">Stock</p>
                      <p className="text-2xl font-semibold font-Playfair text-CharcoalBlack">{product.totalstock}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={()=>setSelectedProduct(product.productId)} className="flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-offwhite/70 backdrop-blur-sm border border-gray-200 text-CharcoalBlack hover:bg-offwhite hover:border-gold/50 flex items-center justify-center gap-2">
                      <FiEdit />
                      Edit
                    </button>
                    <button className="p-3 hover:bg-red-200 rounded-xl transition-all duration-300 text-red-500">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Deliveryboys':
        return (
          <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-auto">
            {/* Header */}
            <div className="backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl bg-gradient-to-tl from-blue-600 to-blue-500  text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">DeliveryBoy Management</h1>
                  <p className="text-lg opacity-90">View and manage your deliveryboy base</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={()=>{setFilterOpen(!isfilterOpen);setItem('Deliveryboy')}} className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-gradient-to-l from-sky-200 to-sky-200 text-CharcoalBlack hover:shadow-glow transform hover:-translate-y-1 flex items-center gap-2">
                    <FiFilter />
                    Filter
                  </button>
                  <button className=" px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-gradient-to-l from-yellow-500 to-yellow-400 text-CharcoalBlack hover:shadow-lg transform hover:-translate-y-1 flex items-center gap-2">
                    <FiPlus />
                    Add DeliveryBoy
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emeraldgreen/20 rounded-xl">
                    <FiPackage className="text-emeraldgreen text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">Free</p>
                <p className="text-3xl font-bold text-CharcoalBlack">{free}</p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gold/20 rounded-xl">
                    <FiPackage className="text-gold text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">On Delivery</p>
                <p className="text-3xl font-bold text-CharcoalBlack">{ondelivery}</p>
              </div>

              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-royalpurple/40 cursor-pointer relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl text-white">
                    <FiPackage className="text-xl" />
                  </div>
                </div>
                <p className="text-sm text-warmgrey font-medium mb-1">Total DeliveryBoys </p>
                <p className="text-3xl font-bold text-CharcoalBlack">{totaldeliveryboy}</p>
              </div>
            </div>

            {/* Search */}
            <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-royalpurple/30 transition-all duration-500 hover:-translate-y-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warmgrey" />
                <input
                  type="text"
                  placeholder="Search deliveryboy by username, name, or phone..."
                  className="w-full pl-12 pr-6 py-4 bg-offwhite border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-royalpurple/50 focus:border-royalpurple/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* delivery boy List */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {deliveyboys.map((boy) => (
                <div
                  key={boy._id}
                  className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group hover:border-royalpurple/30 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                        <span className="text-xl font-bold text-CharcoalBlack">
                          {boy.profileImg ? <img
                            src={boy.profileImg.url}
                            className="w-16 h-16 rounded-full"
                          /> : boy.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-medium font-sans text-CharcoalBlack group-hover:text-royalpurple transition-colors">
                          {boy.name}
                        </h3>
                        <p className="text-warmgrey text-sm">{boy.username}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${getBoyStatusColor(boy.is_ondelivery).color}`}>
                      {getBoyStatusColor(boy.is_ondelivery).Status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-warmgrey">
                      <FiMail className="text-royalpurple" />
                      <span className="text-sm">{boy.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-warmgrey">
                      <FiPhone className="text-royalpurple" />
                      <span className="text-sm">+91 {boy.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-warmgrey">
                      <FiTruck className="text-royalpurple" />
                      <span className="text-sm">{boy.vehicle_type}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div>
                      <p className="text-sm text-warmgrey mb-1">Delivered Orders</p>
                      <p className="text-2xl font-bold text-CharcoalBlack">{boy.orders}</p>
                    </div>
                    <button onClick={()=>{setSelectedDeliveryboy(boy._id);setAssignOpen(!isAssignopen)}} className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-offwhite/80 backdrop-blur-sm border border-gray-300 text-CharcoalBlack hover:border-gold/50">Assign Order</button>
                    <button className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-offwhite/80 backdrop-blur-sm border border-gray-300 text-CharcoalBlack hover:border-gold/50">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex-1 p-4 lg:p-8 space-y-6 lg:space-y-8 overflow-auto">
            {/* Header */}
            <div className="backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl bg-gradient-to-tl from-blue-600 to-blue-500  text-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Profile Managment</h1>
                  <p className="text-lg opacity-90">Manage your account and preferences</p>
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
                    <h3 className="text-xl font-semibold text-CharcoalBlack">Profile Settings</h3>
                    <p className="text-warmgrey">Manage your personal information</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-CharcoalBlack mb-2">UserName</label>
                    <input
                      type="text"
                      Value={username}
                      onChange={(e)=>{
                        setHideButton(false)
                        const newValue = e.target.value;
                        setUsername(newValue.trim().slice(0,14))
                        setHideButton(newValue == seller.username)
                      }}
                      className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-CharcoalBlack mb-2">Name</label>
                    <input
                      type="text"
                      Value={name}
                      onChange={(e)=>{
                        setHideButton(false)
                        const newValue = e.target.value;
                        setName(newValue.trim().slice(0,15))
                        setHideButton(newValue == seller.name)
                      }}
                      className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-CharcoalBlack mb-2">Email</label>
                    <input
                      type="email"
                      Value={email}
                      onChange={(e)=>{
                        setHideButton(false)
                        const newValue = e.target.value;
                        setEmail(newValue.trim())
                        setHideButton(newValue == seller.email)
                      }}
                      className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-CharcoalBlack mb-2">Phone(+91)</label>
                    <input
                      type="text"
                      Value={phone}
                      onChange={(e)=>{
                        setHideButton(false)
                        const onlyDigits = e.target.value.replace(/\D/g, '');
                        const limitedDigits = onlyDigits.slice(0, 10).trim();
                        setPhone(Number(limitedDigits));
                        setHideButton( limitedDigits == seller.phone)
                      }}
                      className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-CharcoalBlack mb-2">ShopName</label>
                    <input
                      type="text"
                      Value={shopname}
                      onChange={(e)=>{
                        setHideButton(false)
                        const newValue = e.target.value;
                        setShopname(newValue.trim().slice(0,20))
                        setHideButton( newValue == seller.shopname)
                      }}
                      className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                    />
                  </div>
                  {!hidebutton && (
                    <button className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-blue-600 text-white hover:shadow-glow transform hover:-translate-y-1 w-full" onClick={()=>updateDetail()}>Save Changes</button>
                  )}
                </div>
              </div>

              {/* Payment Settings */}
              {/* <div className="dashboard-card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-success rounded-xl text-white">
                    <FiCreditCard className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-CharcoalBlack">Payment Methods</h3>
                    <p className="text-warmgrey">Manage your payment options</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-primary rounded-xl text-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-80">Primary Card</span>
                      <FiCreditCard className="text-xl" />
                    </div>
                    <p className="text-lg font-bold mb-1">•••• •••• •••• 4532</p>
                    <p className="text-sm opacity-80">Expires 12/25</p>
                  </div>

                  <button className="btn-secondary w-full">Add New Card</button>
                  <button className="btn-secondary w-full">Manage Billing</button>
                </div>
              </div> */}

              {/* Contact Settings */}
              <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-royalpurple/30 transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-600 rounded-xl text-white">
                    <FiMail className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-CharcoalBlack">Contact & Support</h3>
                    <p className="text-warmgrey">Get help and support</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full p-4 bg-offwhite hover:bg-warmgrey/10 rounded-xl transition-all text-left">
                    <p className="font-semibold text-CharcoalBlack">Help Center</p>
                    <p className="text-sm text-royalpurple">Browse articles and guides</p>
                  </button>
                  <button className="w-full p-4 bg-offwhite hover:bg-warmgrey/10 rounded-xl transition-all text-left">
                    <p className="font-semibold text-CharcoalBlack">Contact Support</p>
                    <p className="text-sm text-royalpurple">Get in touch with our team</p>
                  </button>
                  <button className="w-full p-4 bg-offwhite hover:bg-warmgrey/10 rounded-xl transition-all text-left">
                    <p className="font-semibold text-CharcoalBlack">Feature Requests</p>
                    <p className="text-sm text-royalpurple">Suggest new features</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null;;
    }
  }
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
        <div className={`
        fixed lg:relative lg:translate-x-0 w-72 h-screen flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
          <div
            className="h-full m-4 overflow-hidden bg-CharcoalBlack rounded-2xl shadow-2xl backdrop-blur-md border border-white/20"
          >
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
                  <h1 className="text-[18px] text-pretty font-sans font-medium text-white">{shopname}</h1>
                  <p className="text-white/70 text-xs font-sans lg:text-sm">{name}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 lg:p-6 space-y-2 ">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-offwhite hover:bg-white/10 transition-all duration-300 cursor-pointer relative overflow-hidden ${activesection == item.label ? 'bg-gradient-to-r from-royalpurple/40 to-gold/30' : ''}`}
                  onClick={() => selectedoption(item.label)}
                >
                  <item.icon className="text-lg lg:text-xl" />
                  <span className="flex-1 font-medium text-sm lg:text-base">{item.label}</span>
                  {item.count && (
                    <span className="bg-gold text-CharcoalBlack text-xs px-2 lg:px-3 py-1 lg:py-1.5 rounded-full font-bold shadow-md">
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
              <Link to='/sellerlogin' className=' flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-100/20 overflow-hidden cursor-pointer'>
                <FiLogOut className="text-lg lg:text-xl"/>
                <span className="flex-1 font-medium text-sm lg:text-base">LogOut</span>
              </Link>
            </nav>

            {/* User Profile */}
            <div className="p-4 lg:p-6 border-t border-white/10">
              <div className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer ${activesection == 'profile' ? 'bg-gradient-to-r from-royalpurple/40 to-gold/30' : 'bg-white/10'}`} onClick={() => selectedoption('profile')}>
                <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gold rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-CharcoalBlack font-bold text-sm lg:text-lg">{name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-pretty text-sm lg:text-base">{name}</p>
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
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* filter part */}
      {isfilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setFilterOpen(!isfilterOpen);
          }}
        >
          <div className="w-full max-w-[500px] bg-offwhite border border-gray-200 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h2 className="text-xl sm:text-2xl font-medium font-sans text-CharcoalBlack">Filter {item}s</h2>
                <div className="flex items-center gap-5">
                  <button
                    onClick={()=>handleReset()}
                    className="text-sm font-normal text-warmgrey hover:text-royalpurple transition-colors"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={()=>setFilterOpen(!isfilterOpen)}
                    className="text-warmgrey hover:text-CharcoalBlack transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Status For all */}
              <div className="space-y-3">
                <label className="text-base font-sans text-CharcoalBlack block">Status</label>
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <div
                      key={status.id}
                      className={`flex items-center space-x-3 p-3 rounded-xl ${status.id == selectedStatuses ? 'bg-black/5' : ''} hover:bg-black/5 transition-colors cursor-pointer`}
                      onClick={() => setSelectedStatuses(status.id)}
                    >
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <input
                          type="checkbox"
                          id={status.id}
                          checked={selectedStatuses.includes(status.id)}
                          onChange={() => setSelectedStatuses(status.id)}
                          className="peer w-5 h-5 rounded border-2 border-gray-200 appearance-none checked:bg-royalpurple checked:border-royalpurple cursor-pointer transition-all"
                        />
                        <FiCheck
                          className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                        />
                      </div>
                      <label
                        htmlFor={status.id}
                        className="flex-1 cursor-pointer flex items-center gap-2"
                      >
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other conent  */}
              {item == 'Order' && (<div className="space-y-3">
                <label className="text-base font-sans text-CharcoalBlack block">Total Items</label>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  {itemRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setDateRange(range.id)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${dateRange === range.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-warmgrey hover:bg-white hover:text-CharcoalBlack'
                        }`}
                    >
                      {dateRange === range.id && <FiCheck className="inline mr-2" />}
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>)}

              {item == 'Product' && (<div className="space-y-3">
                <label className="text-base font-sans text-CharcoalBlack block">Categories</label>
                <div className="space-y-2">
                  {categories.map((status) => (
                    <div
                      key={status._id}
                      className={`flex items-center space-x-3 p-3 rounded-xl ${status._id == secSelectedStatus ? 'bg-black/5' : ''} hover:bg-black/5 transition-colors cursor-pointer`}
                      onClick={() => setSecSeletedStatus(status._id)}
                    >
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <input
                          type="checkbox"
                          id={status._id}
                          checked={secSelectedStatus.includes(status._id)}
                          onChange={() => setSecSeletedStatus(status._id)}
                          className="peer w-5 h-5 rounded border-2 border-gray-200 appearance-none checked:bg-royalpurple checked:border-royalpurple cursor-pointer transition-all"
                        />
                        <FiCheck
                          className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                        />
                      </div>
                      <label
                        htmlFor={status._id}
                        className="flex-1 cursor-pointer flex items-center gap-2"
                      >
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status._id == secSelectedStatus ? 'text-royalpurple' : 'text-CharcoalBlack'}`}>
                          {status.name}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>)}

              {item == 'Product' && (
                <div className="space-y-3">
                  <label className="text-base font-sans text-CharcoalBlack block">Discount Range</label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {DiscountforProduct.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setDiscount(range.id)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${discount === range.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-warmgrey hover:bg-white hover:text-CharcoalBlack'
                          }`}
                      >
                        {discount === range.id && <FiCheck className="inline mr-2" />}
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              {item != 'Deliveryboy' && (<div className="space-y-3">
                <label className="text-base font-sans text-CharcoalBlack block">Price Range</label>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setPriceRange(range.id)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${priceRange === range.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-warmgrey hover:bg-white hover:text-CharcoalBlack'
                        }`}
                    >
                      {priceRange === range.id && <FiCheck className="inline mr-2" />}
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>)}

              {item == 'Deliveryboy' && (
                <div className="space-y-3">
                  <label className="text-base font-sans text-CharcoalBlack block">Vehicle Type</label>
                  <div className="space-y-2">
                    {vehicleforboy.map((status) => (
                      <div
                        key={status.id}
                        className={`flex items-center space-x-3 p-3 rounded-xl ${status.id == vehicle ? 'bg-black/5' : ''} hover:bg-black/5 transition-colors cursor-pointer`}
                        onClick={() => setVehicle(status.id)}
                      >
                        <div className="relative w-5 h-5 flex items-center justify-center">
                          <input
                            type="checkbox"
                            id={status.id}
                            checked={vehicle.includes(status.id)}
                            onChange={() => setVehicle(status.id)}
                            className="peer w-5 h-5 rounded border-2 border-gray-200 appearance-none checked:bg-royalpurple checked:border-royalpurple cursor-pointer transition-all"
                          />
                          <FiCheck
                            className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                          />
                        </div>
                        <label
                          htmlFor={status.id}
                          className="flex-1 cursor-pointer flex items-center gap-2"
                        >
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.id == vehicle ? 'text-royalpurple' : 'text-CharcoalBlack'}`}>
                            {status.label}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item == 'Deliveryboy' && (
                <div className="space-y-3">
                  <label className="text-base font-sans text-CharcoalBlack block">Delivered Orders Range</label>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {deliveredorder.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setDeliveredOrder(range.id)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${deliveredOrder === range.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-warmgrey hover:bg-white hover:text-CharcoalBlack'
                          }`}
                      >
                        {deliveredOrder === range.id && <FiCheck className="inline mr-2" />}
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-gray-300">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={()=>handleReset()}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-CharcoalBlack hover:bg-surface-hover transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <FiX />
                  Clear
                </button>
                <button
                  onClick={()=>handleFilter()}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-500 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium shadow-lg"
                >
                  <FiCheck />
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Order */}
      {isAssignopen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-sm">
          <div className="bg-offwhite backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-royalpurple/30 transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-center gap-5 mb-6">
              <div className="p-3 bg-blue-600 rounded-xl text-white">
                <FiUser className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-CharcoalBlack">Assign Order</h3>
                <p className="text-warmgrey">Manage your order by assign to Deliveryboy</p>
              </div>
              <button onClick={()=>setAssignOpen(!isAssignopen)} className="text-warmgrey text-xl hover:text-CharcoalBlack transition-colors"><FiX/></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-CharcoalBlack mb-2">Deliveryboy Id</label>
                <input
                  type="text"
                  defaultValue={selectedDeliveryboy}
                  disabled
                  className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-CharcoalBlack mb-2">Order Id</label>
                <input
                  type="text"
                  value={orderId}
                  placeholder='Enter OrderId'
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setOrderid(newValue.trim())
                  }}
                  className="w-full px-4 py-3 bg-offwhite border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-royalpurple focus:border-royalpurple/50 transition-all"
                />
              </div>
              
              <button className="px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 bg-blue-600 text-white hover:shadow-glow transform hover:-translate-y-1 w-full" onClick={()=>AssignOrder()}>Assign</button>
            </div>
          </div>
        </div>
      )}

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
                <label className="block text-sm font-semibold text-warmgrey mb-2">OrderId</label>
                <div className=' flex space-x-5'>
                  <p className="text-lg font-medium text-CharcoalBlack">{orderDetail.id}</p>
                  <button onClick={()=>{navigator.clipboard.writeText(orderDetail.id);toast.success('copied')}}><FiCopy/></button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">Status</label>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${getOrderStatusColor(orderDetail.status)} flex items-center justify-center`}>
                    {getStatusIcon(orderDetail.status)}
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getOrderStatusColor(orderDetail.status)}`}>
                    {orderDetail.status}
                  </span>
                </div>
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">Customer</label>
                <p className="text-lg font-medium text-CharcoalBlack">{orderDetail.customer}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">DeliveryBoy</label>
                <p className="text-lg font-medium text-CharcoalBlack">{orderDetail?.deliveryboy ? orderDetail.deliveryboy : 'Not assign'}</p>
              </div>
              {/* Product */}
              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">Order items</label>
                {orderDetail && orderDetail.items && orderDetail.items.map((product)=>(
                  <div className="flex items-center space-x-4 p-4 bg-offwhite rounded-lg">
                    <img
                      src={product?.image?.url}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-sans text-CharcoalBlack text-sm mb-1">
                        {product.name}
                      </h3>
                      <span className="font-sans text-sm text-center" >{product.variantname}</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className=" text-warmgrey font-sans">Quantity:</h3>
                          <span className="font-Manrope text-sm w-8 text-center">{product.quantity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <h3 className=" text-warmgrey font-sans">Price:</h3>
                          <span className="font-Manrope font-medium text-DeepNavy">
                            ₹{(product.discount_price * product.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">Total Amount</label>
                <p className="text-lg font-medium text-CharcoalBlack">{orderDetail.total_price}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">Payment Status</label>
                <p className="text-lg font-medium text-CharcoalBlack">{orderDetail.payment_status}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">Shipping Address</label>
                <p className="text-lg font-medium text-CharcoalBlack">{orderDetail.address}</p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-warmgrey mb-2">Order Date</label>
                <p className="text-lg font-medium text-CharcoalBlack">{orderDetail?.date ? orderDetail.date.split('T')[0] : 'N/A'}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-300">
                  Track Order
                </button>
                <button className="flex-1 px-6 py-3 bg-white border border-gray-300 text-Charcoalblack rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300">
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddProductOpen && <AddProduct onclose={closeAddProduct}/>}
      {selectedProduct!=='' && <UpdateProduct onclose={()=>setSelectedProduct('')} id={selectedProduct}/>}
    </>
  )
}

export default SellerDashboard
