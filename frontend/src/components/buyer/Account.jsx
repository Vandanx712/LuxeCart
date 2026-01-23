import React, { useEffect, useState, useRef } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { FiUser, FiPackage, FiBell, FiHeart, FiMapPin, FiLogOut, FiMenu, FiX, FiShoppingCart, FiArrowLeft,   FiUpload, FiCamera } from 'react-icons/fi';
import axios from 'axios';
import { FaCoins } from 'react-icons/fa';
import { toast,Toaster } from 'react-hot-toast';


const AccountPage = () => {
    const [activeSection, setActiveSection] = useState('My Account');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [buyer, setBuyer] = useState({})
    const [coins,setCoins] = useState(0)
    const [orders,setOrders] = useState([])
    const [address,setAddress] = useState()
    const [username,setUsername] = useState(buyer.username)
    const [name,setName] = useState(buyer.name)
    const [email,setEmail] = useState(buyer.email)
    const [contactNo,setContactNo] = useState(buyer.phone)
    const [hideButton,setHideButton] = useState(true)
    const [openAddressForm,setOpenAddressForm] = useState(false)
    const [street,setStreet] = useState('')
    const [city,setCity] = useState('')
    const [state,setState] = useState('')
    const [pincode,setPincode] = useState('')
    const [isEditAddress,setIsEditAddress] = useState('')
    const navigate = useNavigate()

    const [profileImg,setProfileImg] = useState(buyer.profileImg)
    const [uploading, setUploading] = useState(false);
    const fileinputRef = useRef(buyer.profileImg)

    const menuItems = [
        { name: 'My Account', icon: FiUser },
        { name: 'My Orders', icon: FiPackage },
        { name: 'My Coins', icon:FaCoins},
        { name: 'Notifications', icon: FiBell },
        { name: 'Cart', icon:FiShoppingCart},
        { name: 'Favourites', icon: FiHeart },
        { name: 'Delivery Addresses', icon: FiMapPin },
        {name: 'Continue Shooping' , icon:FiArrowLeft}
    ];

    useEffect(() => {
        loadBuyer()
        loadCoin()
        loadAddress()
        loadOrder()
    }, [])

    useEffect(() => {
        loadBuyer()
    }, [profileImg])
    
    async function loadBuyer() {
        try {
            const id = localStorage.getItem('id')
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/get/${id}`, { withCredentials: true })
            setBuyer(response.data.buyer)
            setUsername(response.data.buyer.username)
            setName(response.data.buyer.name)
            setEmail(response.data.buyer.email)
            setContactNo(response.data.buyer.phone)
        } catch (error) {
            console.log(error)
        }
    }
    async function loadCoin() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/getcoin`,{withCredentials:true})
            setCoins(response.data.coins.coincount)
        } catch (error) {
            console.log(error)
        }
    }
    async function loadAddress() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getallAddress`,{withCredentials:true})
            const Address = response.data.addresses.map((add)=>{
                const id = add._id
                const street = add.street
                const city = add.city
                const state = add.state
                const pincode = add.zip_code
                const Default = add.is_default

                return {id,street,city,state,pincode,Default}
            })
            setAddress(Address)
        } catch (error) {
            console.log(error)
        }
    }

    const loadOrder = async()=>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/allorder`,{withCredentials:true})
            setOrders(response.data.orders)
        } catch (error) {
           console.log(error) 
        }
    }

    async function updateUser() {
        const emailvalid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if ( emailvalid.test(email) === false ) toast.error('Plz enter valid email')
        else {
            try {
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/buyer/updateprofile`, {
                    username: username,
                    name: name,
                    email: email,
                    phone: contactNo
                },{withCredentials:true})
                toast.success(response.data.message)
                setBuyer(response.data.updatedBuyer)
                setHideButton(true)
            } catch (error) {
                toast.error(error.response?.data.message)
                console.log(error)
            }
        }
    }

    const NewAddress = async()=>{
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/addAddress`,{
                street,
                city,
                state,
                zipcode:pincode
            },{withCredentials:true})
            toast.success(response.data.message)
            setOpenAddressForm(false)
            loadAddress()
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data.message)
        }
    }

    const updateaddress = async()=>{
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/updateaddress`,{
                addressId:isEditAddress,
                street,
                city,
                state,
                zipcode: pincode
            },{withCredentials:true})
            clearAddState()
            toast.success(response.data.message)
            loadAddress()
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async(address)=>{
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/deleteaddress/${address.id}`,{withCredentials:true})
            loadAddress()
            toast.success(response.data.message)
        } catch (error) {
            console.log(error)
        }
    } 

    const uploadpic = async(e)=>{   
        try {
            setUploading(true);    
            const files = e.target.files
            const formdata = new FormData()
            for(let i=0;i<files.length;i++){
                formdata.append('avatar',files[i])
            }
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/profilepic/set`,formdata,{headers:{'Content-Type':"multipart/form-data"},withCredentials:true})
            setProfileImg(response.data.profileImg)
        } catch (error) {
            console.error(error)
        } finally {
            setUploading(false);
            e.target.value = null;
        }
    }
     
    const updatepic=async(e)=>{
        try {
            setUploading(true)
            const file = e.target.files[0]
            const formdata = new FormData()
            formdata.append('oldkey',buyer.profileImg.key)
            formdata.append('avatar',file)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/profilepic/update`,formdata,{withCredentials:true})
            setProfileImg(response.data.profileImg)
        } catch (error) {
            console.error(error)
        }finally{
            setUploading(false)
            e.target.value=null
        }
    }

    const clearAddState = ()=>{
        setOpenAddressForm(false)
        setStreet('')
        setCity('')
        setState('')
        setPincode('')
    }

    const handleEdit = (address)=>{
        setStreet(address.street)
        setCity(address.city)
        setState(address.state)
        setPincode(address.pincode)
        setIsEditAddress(address.id)
        setOpenAddressForm(true)
    }

    const renderContent = () => {
        switch (activeSection) {
            case 'My Account':
                return (
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-Playfair font-medium text-CharcoalBlack mb-6">My Account</h2>
                        <div className="bg-warmgrey/15 rounded-lg p-6 mb-6">
                            <div className="flex items-center space-x-4 mb-6">
                                {buyer.profileImg && (
                                    <div className='relative'>
                                        <img
                                            className=' w-17 h-17 bg-royalpurple rounded-full object-cover border border-offwhite'
                                            src={buyer.profileImg.url}
                                        />
                                        <div className='absolute right-0 bottom-13'>
                                            <input type='file' ref={fileinputRef} onChange={updatepic} hidden accept='image/*'/>
                                            <FiCamera onClick={()=>fileinputRef.current.click()} className='size-5 text-gray-600 cursor-pointer'/>
                                        </div>
                                    </div>
                                )}

                                <div className={` ${buyer.profileImg && 'hidden'} relative w-17 h-17 bg-royalpurple rounded-full flex items-center justify-center`}>
                                    <span className="text-offwhite font-Playfair font-medium text-3xl">{buyer?.name?.length > 0 ? buyer.name[0] : ''}</span>
                                    <div className='absolute right-0 bottom-13'>
                                        <input type="file" ref={fileinputRef} onChange={uploadpic}  hidden accept='image/*' />
                                        <FiUpload onClick={()=>fileinputRef.current.click()} className='size-5 text-deep-navy-dark cursor-pointer'/>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-Playfair font-medium text-CharcoalBlack">{buyer.username}</h3>
                                    <p className="text-gray-500 font-Manrope">{buyer.email}</p>
                                </div>
                            </div>
                            <div className=" flex-col space-y-5">
                                <div>
                                    <label className="block text-sm font-Manrope text-CharcoalBlack mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => {
                                            setHideButton(false)
                                            const newValue = e.target.value;
                                            setUsername(newValue.trim());
                                            setHideButton(newValue === buyer.username);
                                        }}
                                        className="w-full px-3 py-2 border bg-white border-warmgrey/30 rounded-md font-Manrope focus:outline-none focus:border-royalpurple"
                                    />
                                </div>
                                <div className="">
                                    <label className="block text-sm font-Manrope text-CharcoalBlack mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setHideButton(false)
                                            const newValue = e.target.value;
                                            setName(newValue.trim());
                                            setHideButton(newValue === buyer.name);
                                        }}
                                        className="w-full px-3 py-2 border bg-white border-warmgrey/30 rounded-md font-Manrope focus:outline-none focus:border-royalpurple"
                                    />
                                </div>
                                <div className="">
                                    <label className="block text-sm font-Manrope text-CharcoalBlack mb-2">Email</label>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => {
                                            setHideButton(false)
                                            const newValue = e.target.value;
                                            setEmail(newValue);
                                            setHideButton(newValue === buyer.email);
                                        }}
                                        className="w-full px-3 py-2 border bg-white border-warmgrey/30 rounded-md font-Manrope focus:outline-none focus:border-royalpurple"
                                    />
                                </div>
                                <div className="">
                                    <label className="block text-sm font-Manrope text-CharcoalBlack mb-2">Phone No</label>
                                    <input
                                        type='text'
                                        value={contactNo}
                                        className="w-full px-3 py-2 border bg-white border-warmgrey/30 rounded-md font-Manrope focus:outline-none focus:border-royalpurple"
                                        onChange={(e) => {
                                            setHideButton(false)
                                            const onlyDigits = e.target.value.replace(/\D/g, '');
                                            const limitedDigits = onlyDigits.slice(0, 10);
                                            setContactNo(Number(limitedDigits.trim()));
                                            setHideButton( limitedDigits == buyer.phone);
                                        }}
                                    />
                                </div>
                            </div>
                            {!hideButton && (
                                <button className="mt-6 w-full bg-royalpurple hover:bg-royalpurple/90 text-white font-Manrope px-6 py-2 rounded-md transition-colors" onClick={updateUser}>
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                );

            case 'My Orders':
                return (
                    <div className="max-w-4xl">
                        <h2 className="text-2xl font-Playfair font-medium text-CharcoalBlack mb-6">My Orders</h2>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-offwhite rounded-lg p-6 border border-warmgrey/20">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                        <div>
                                            <h3 className="font-Playfair text-deep-navy-dark">OrderId: {order._id} </h3>
                                            <p className="text-sm text-warmgrey font-Manrope">Placed on: {order.placedon.split('T')[0]}</p>
                                        </div>
                                        <span className="bg-royalpurple/10 text-royalpurple px-3 py-1 rounded-full text-sm font-Manrope mt-2 sm:mt-0 w-fit">
                                            {order.order_status}
                                        </span>
                                    </div>
                                    {order.items.map((item) => (
                                        <div className="flex items-center space-x-5 space-y-5">
                                            <img src={item?.image[0]?.url} className="w-20 h-20 bg-warmgrey/20 rounded-lg"/>
                                            <div className="flex-1">
                                                <p className="font-sans text-deep-navy-dark">{item.name}</p>
                                                <span className='text-sm text-warmgrey font-sans'>{item.variantname}</span>
                                                <div className=' flex space-x-2'>
                                                    <label className='font-Monrope text-sm text-deep-navy-dark'>Quantity: </label>
                                                    <span className=' font-sans text-warmgrey text-sm'>{item.quantity}</span>
                                                </div>
                                            </div>
                                            <span className="font-Monrope text-lg text-CharcoalBlack">₹{item.price}</span>
                                        </div>
                                    ))}
                                    <div className=' flex space-x-2'> 
                                        <label className='font-Monrope text-lg text-deep-navy-dark'>Total Price:</label>
                                        <span className=' font-sans text-warmgrey text-lg'>₹{order.totalprice}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'My Coins':
                return(
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-Playfair font-medium text-CharcoalBlack mb-6">My Coins</h2>
                        <div className="space-y-4">
                            <div className="p-4">
                                <div className="flex items-center space-x-7 p-3 text-3xl">
                                    <img src='/coin.png' className=' h-10 w-10 animate-bounce' />
                                    <p className=" text-royalpurple/90 font-Playfair">{coins} Coins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'Notifications':
                return (
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-Playfair font-medium text-CharcoalBlack mb-6">Notifications</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((notification) => (
                                <div key={notification} className="bg-offwhite rounded-lg p-4 border border-warmgrey/20">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-royalpurple rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="font-Manrope text-CharcoalBlack">Your order has been shipped</p>
                                            <p className="text-sm text-warmgrey font-Manrope mt-1">2 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            

            case 'Cart':
                return (
                    navigate('/buyer/cart')
                );

            case 'Favourites':
                return (
                    navigate('/buyer/wishlist')
                );

            case 'Delivery Addresses':
                return (
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-Playfair font-medium text-CharcoalBlack mb-6">Delivery Addresses</h2>
                        <div className="space-y-4 mb-6">
                            {address.map((address,index) => (
                                <div key={address.id} className="bg-offwhite rounded-lg p-4 border border-warmgrey/20">
                                    <div className="flex items-center justify-evenly text-pretty space-y-3">
                                        <div className=' w-[450px] h-auto'>
                                            <h3 className="font-Playfair text-xl font-medium text-CharcoalBlack">Home Address - {index+1}</h3>
                                            <p className="text-gray-500 font-Manrope mt-8 mb-2 text-pretty">
                                                {address.street} <br />
                                                {address.city}, {address.state} - {address.pincode} <br />
                                                India
                                            </p>
                                            {address.Default && (
                                                <span className="bg-royalpurple/10 text-royalpurple px-3 py-1 rounded-full text-sm font-Manrope">
                                                    Default Address
                                                </span>
                                            )}
                                        </div>
                                        <div className='flex space-x-5'>
                                            <button className="text-royalpurple hover:text-royalpurple/50 font-Manrope text-lg transition-colorsv cursor-pointer" onClick={()=>handleEdit(address)}>
                                                Edit
                                            </button>
                                            <button className="text-red-700 hover:text-red-400 font-Manrope text-lg transition-colors cursor-pointer" onClick={() => handleDelete(address)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="bg-royalpurple hover:bg-royalpurple/90 text-white font-Manrope px-6 py-2 rounded-md transition-colors" onClick={()=>setOpenAddressForm(true)}>
                            Add New Address
                        </button>
                        {openAddressForm && (<div className=" bg-warmgrey/15 rounded-lg p-6 mt-10 flex-col space-y-5">
                            {isEditAddress.length == 0 && (<div className=' flex items-center justify-between'>
                                <h1 className='text-2xl font-Playfair font-medium text-CharcoalBlack mb-6'>Add New Address</h1>
                                <button className='p-1 text-xl' onClick={()=>setOpenAddressForm(false)}><FiX/></button>
                            </div>)}
                            {isEditAddress.length !== 0 && (<div className=' flex items-center justify-between'>
                                <h1 className='text-2xl font-Playfair font-medium text-CharcoalBlack mb-6'>Update Your Address</h1>
                                <button className='p-1 text-xl' onClick={()=>clearAddState()}><FiX/></button>
                            </div>)}
                            <div>
                                <label className="block text-sm font-Manrope text-CharcoalBlack mb-2">Street</label>
                                <input
                                    type="text"
                                    value={street}
                                    onChange={(e) => {
                                        setStreet(e.target.value)
                                    }}
                                    className="w-full px-3 py-2 border bg-white border-warmgrey/30 rounded-md font-Manrope focus:outline-none focus:border-royalpurple"
                                />
                            </div>
                            <div className="">
                                <label className="block text-sm font-Manrope text-CharcoalBlack mb-2">City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => {
                                       setCity(e.target.value)
                                    }}
                                    className="w-full px-3 py-2 border bg-white border-warmgrey/30 rounded-md font-Manrope focus:outline-none focus:border-royalpurple"
                                />
                            </div>
                            <div className="">
                                <label className="block text-sm font-Manrope text-CharcoalBlack mb-2">State</label>
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => {
                                      setState(e.target.value)
                                    }}
                                    className="w-full px-3 py-2 border bg-white border-warmgrey/30 rounded-md font-Manrope focus:outline-none focus:border-royalpurple"
                                />
                            </div>
                            <div className="">
                                <label className="block text-sm font-Manrope text-CharcoalBlack mb-2">Pincode</label>
                                <input
                                    type='text'
                                    value={pincode}
                                    className="w-full px-3 py-2 border bg-white border-warmgrey/30 rounded-md font-Manrope focus:outline-none focus:border-royalpurple"
                                    onChange={(e) => {
                                        const onlyDigits = e.target.value.replace(/\D/g, '');
                                        const limitedDigits = onlyDigits.slice(0, 6);
                                        setPincode(Number(limitedDigits.trim()));
                                    }}
                                />
                            </div>
                            {isEditAddress.length == 0 && (<button className=" w-full bg-royalpurple hover:bg-royalpurple/90 text-white font-Manrope px-6 py-2 rounded-md transition-colors" onClick={NewAddress}>
                                Add New Address
                            </button>)}
                            {isEditAddress.length !== 0 && (<button className=" w-full bg-royalpurple hover:bg-royalpurple/90 text-white font-Manrope px-6 py-2 rounded-md transition-colors" onClick={updateaddress}>
                                Save Address
                            </button>)}
                        </div>
                            
                        )}
                    </div>
                );
            
            case 'Continue Shooping':
                return (
                    navigate('/')
                )

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Mobile menu button */}
            <div className="sm:hidden bg-warmgrey/15 border-b border-warmgrey/20 p-4">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex items-center space-x-2 text-CharcoalBlack"
                >
                    <FiMenu className="w-5 h-5" />
                    <span className="font-Manrope">Menu</span>
                </button>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className={`
          fixed sm:static inset-y-0 left-0 z-50 h-screen w-80 bg-offwhite/95 border-r border-warmgrey/20 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0 bg-warmgrey/15'}
        `}>
                    <div className="p-6">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="items-center text-CharcoalBlack sm:hidden block"
                        >
                            <FiX className="w-5 h-5 mb-5" />
                        </button>
                        {/* Profile section */}
                        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-warmgrey/20">
                            {buyer.profileImg && (
                                <img
                                    className='w-17 h-17 rounded-full border border-warmgrey/20 object-cover'
                                    src={buyer.profileImg.url}
                                />
                            )}
                            <div className={` ${buyer.profileImg ? 'hidden':'block'} w-17 h-17 bg-royalpurple rounded-full flex items-center justify-center`}>
                                <span className="text-offwhite font-Playfair font-medium text-3xl">{buyer?.name?.length > 0 ? buyer.name[0] : ''}</span>
                            </div>
                            <div>
                                <p className="font-Playfair font-medium text-CharcoalBlack">Hello, {buyer.name}</p>
                                <p className="text-sm text-gray-500 font-Manrope">{buyer.email}</p>
                            </div>
                        </div>

                        {/* Navigation menu */}
                        <nav className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            setActiveSection(item.name);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`
                      w-full flex items-center space-x-3 py-3 px-4 rounded-md transition-colors font-Manrope text-left
                      ${activeSection === item.name
                                                ? 'bg-royalpurple/10 text-royalpurple'
                                                : 'hover:text-royalpurple hover:bg-royalpurple/5 text-CharcoalBlack'
                                            }
                    `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </button>
                                );
                            })}
                            <Link
                                to="/login"
                                className="w-full flex items-center space-x-3 py-3 px-4 rounded-md transition-colors font-Manrope text-red-500 hover:text-red-600 hover:bg-red-100"
                            >
                                <FiLogOut className="w-5 h-5" />
                                <span>Log Out</span>
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Overlay for mobile */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 sm:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Main content */}
                <div className="flex-1 sm:ml-0">
                    <div className="p-6 sm:p-8">
                        {renderContent()}
                    </div>
                </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
            {uploading && (
                <div className="flex fixed z-50 inset-0 flex-col justify-center items-center gap-2 mt-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-sm text-gray-500">Uploading...</p>
                </div>
            )}
        </div>
    );
};

export default AccountPage;