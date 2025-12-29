import React, { useState } from 'react';
import axios from 'axios';
import { Music, Lock, User, Mail } from 'lucide-react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';
    try {
      const response = await axios.post(`https://echo-backend-0rw1.onrender.com${endpoint}`, formData);
      if (isLogin) {
        localStorage.setItem('token', response.data.access_token);
        onLoginSuccess();
      } else {
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
        console.error("Full Error Object:", error.response);
        alert(error.response?.data?.msg || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-500 p-3 rounded-full mb-4 text-black"><Music size={32} /></div>
          <h1 className="text-3xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-zinc-500" size={20} />
            <input 
              type="text" placeholder="Username" required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-10 text-white focus:border-green-500 outline-none"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          {!isLogin && (
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-zinc-500" size={20} />
              <input 
                type="email" placeholder="Email" required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-10 text-white focus:border-green-500 outline-none"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          )}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-zinc-500" size={20} />
            <input 
              type="password" placeholder="Password" required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 px-10 text-white focus:border-green-500 outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-black font-bold py-3 rounded-lg hover:scale-[1.02] transition">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-zinc-500 mt-6 cursor-pointer hover:text-white" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New to Echo? Create an account" : "Already have an account? Sign in"}
        </p>
      </div>
    </div>
  );
};

export default Auth;