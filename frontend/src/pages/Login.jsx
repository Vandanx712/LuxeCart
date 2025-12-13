import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { IoEyeOffOutline, IoEyeOutline, IoMailOutline } from 'react-icons/io5';
import { FiLock, FiUser } from 'react-icons/fi';
import {Toaster,toast} from 'react-hot-toast'
import axios from 'axios'
import ForgetPassword from '../components/common/ForgetPassword';

const Login = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [isforget,setForget] = useState(false)

    useEffect(() => {
        localStorage.clear()
        Logout()
    }, [])

    const Logout = async()=>{
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/logout`,{},{withCredentials:true})
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`,{
                email:email.trim(),
                password:password.trim()
            },{withCredentials:true}) 
            setLocalStorage(response.data.user)
            toast.success(response.data.message)
            const role = response.data.user.role
            if(role=='buyer') navigate('/')
            else if(role=='admin') navigate('/adeshboard')
            else navigate('/dbdeshboard')
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data.message)
        }
    };

    function setLocalStorage(user){
        localStorage.setItem('id',user.id)
        localStorage.setItem('username',user.username)
        localStorage.setItem('email',user.email)
        localStorage.setItem('role',user.role)
        user.profileImg?.url ? localStorage.setItem('profilepic',JSON.stringify(user.profileImg)) : ''
        localStorage.setItem('expirytime',new Date().getDate() + 24 * 60 * 60 * 1000)
    }

    const handleGoogleLogin = async() => {
        try {
           const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/googlelogin`,{withCredentials:true})
           window.location.href = response.data.url
        } catch (error) {
            toast.error(error.response?.data.message)
            console.log(error)
        }
    };

    const handleForgotPassword = () => {
        if(!email){ 
            toast.error('Please enter email to send otp')
            setForget(false)
        }
        else setForget(true)
    };

    return (

        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-DeepNavy to-royalpurple font-manrope p-4 relative">

            {/* Form Card */}
            <div className="w-full max-w-md bg-offwhite/95 shadow-xl rounded-lg p-6 space-y-6 z-10">

                {/* Icon & Welcome */}
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gold rounded-full flex items-center justify-center">
                        <FiUser className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-3xl font-playfair font-bold text-DeepNavy">
                        Welcome Back
                    </p>
                    <p className="text-warmgrey text-base">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-CharcoalBlack font-medium">
                            Email Address
                        </label>
                        <div className="relative">
                            <IoMailOutline className="absolute left-3 top-4 h-4 w-4 text-warmgrey" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                className="pl-10 h-12 w-full bg-white border border-warmgrey/30 focus:border-royalpurple focus:ring-royalpurple/20 rounded"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-CharcoalBlack font-medium">
                            Password
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-3 top-4 h-4 w-4 text-warmgrey" />
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                className="pl-10 pr-10 h-12 bg-white w-full border border-warmgrey/30 focus:border-royalpurple focus:ring-royalpurple/20 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-4 text-warmgrey hover:text-CharcoalBlack transition-colors"
                            >
                                {showPassword ? <IoEyeOffOutline className="h-4 w-4" /> : <IoEyeOutline className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-sm text-royalpurple hover:text-DeepNavy transition-colors font-medium"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-br from-DeepNavy to-royalpurple hover:opacity-90 text-white font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] rounded"
                    >
                        Sign In
                    </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center">
                    <hr className="flex-grow border-t border-warmgrey/30" />
                    <span className="mx-2 text-sm text-warmgrey px-2">
                        Or
                    </span>
                    <hr className="flex-grow border-t border-warmgrey/30" />
                </div>

                {/* Google Login */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full h-12 border bg-white border-warmgrey/30 hover:bg-offwhite/50 text-CharcoalBlack font-medium transition-all duration-300 rounded flex items-center justify-center"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Sign Up & Seller */}
                <div className="space-y-4 pt-2 text-center">
                    <div>
                        <span className="font-semibold text-royalpurple">Don't have an account? </span>
                        <button
                            type="button"
                            onClick={() => navigate('/signup')}
                            className="text-sm text-CharcoalBlack hover:text-royalpurple hover:text-[15px] transition-colors"
                        >
                            Sign Up
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={()=> navigate('/sellerlogin')}
                        className="text-sm bg-gradient-to-l from-gold to-gold/90 text-white px-6 py-2 rounded-full hover:opacity-90 transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                        Become a Seller
                    </button>
                </div>
            </div>
            {isforget && <ForgetPassword onclose={()=>setForget(false)} email={email}/>}
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
};

export default Login;