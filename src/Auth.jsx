import React, { useState } from 'react';
import axios from 'axios';
import { Music, User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // Added to fix NotNullViolation
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- LIVE RENDER URL ---
  const BACKEND_URL = "https://echo-backend-0rw1.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Prepare payload: email is MANDATORY for registration
    const payload = isLogin 
      ? { username, password } 
      : { username, email, password };

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (isLogin) {
        // Successful login: store token and notify App.jsx
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', username);
        onLoginSuccess();
      } else {
        // Successful registration: switch to login view
        setIsLogin(true);
        alert("Account created successfully! Please sign in with your new credentials.");
      }
    } catch (err) {
      console.error("Auth Error details:", err.response?.data);
      // Display the specific error from the backend if available
      setError(err.response?.data?.error || "Authentication failed. Check your connection or details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 shadow-2xl border border-zinc-800">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-500 p-3 rounded-full mb-4">
            <Music className="text-black" size={32} fill="black" />
          </div>
          <h1 className="text-3xl font-bold text-white">Echo</h1>
          <p className="text-zinc-500 mt-2">
            {isLogin ? "Welcome Back" : "Create your account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-green-500 transition-all text-white"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Email - ONLY shown for Registration */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-green-500 transition-all text-white"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-green-500 transition-all text-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 mt-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm">
            {isLogin ? "New to Echo?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-green-500 hover:underline font-medium"
            >
              {isLogin ? "Sign up now" : "Log in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;