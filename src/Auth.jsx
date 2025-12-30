import React, { useState } from 'react';
import axios from 'axios';
import { Music, User, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // State for the email field
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Your live Render backend URL
  const BACKEND_URL = "https://echo-backend-0rw1.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Prepare the data to send. Register needs username, email, and password.
    const payload = isLogin 
      ? { username, password } 
      : { username, email, password };

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, payload);

      if (isLogin) {
        // Successful Login: save token and move to main app
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', username);
        onLoginSuccess();
      } else {
        // Successful Registration: tell user and switch to login view
        setIsLogin(true);
        alert("Account created successfully! Please sign in.");
      }
    } catch (err) {
      console.error("Auth error:", err.response?.data);
      setError(err.response?.data?.error || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 shadow-2xl border border-zinc-800">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-500 p-3 rounded-full mb-4">
            <Music className="text-black" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Echo</h1>
          <p className="text-zinc-500 mt-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-green-500 transition-all"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Email Input - Only shown during Registration */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-green-500 transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-green-500 transition-all"
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
                {isLogin ? "Sign In" : "Sign Up"}
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
              {isLogin ? "Create account" : "Sign in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;