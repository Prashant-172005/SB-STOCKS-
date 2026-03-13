import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <span className="text-xl font-bold text-green-400">📈 SB Stocks</span>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">Login</Link>
          <Link to="/register" className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition">Get Started</Link>
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-4 text-6xl">📊</div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          Trade Smarter
        </h1>
        <p className="text-gray-400 text-xl max-w-xl mb-10">
          Real-time stock tracking, portfolio management, and trading history — all in one place.
        </p>
        <div className="flex gap-4">
          <Link to="/register" className="px-8 py-4 bg-green-500 hover:bg-green-400 text-black font-bold text-lg rounded-xl transition">
            Start Trading
          </Link>
          <Link to="/login" className="px-8 py-4 border border-gray-600 hover:border-green-500 text-gray-300 hover:text-white font-bold text-lg rounded-xl transition">
            Sign In
          </Link>
        </div>
        <div className="mt-20 grid grid-cols-3 gap-8 text-center">
          {[['📈','Real-time Prices','Live market data'],['💼','Portfolio','Track your holdings'],['📋','History','Full trade logs']].map(([icon,title,desc])=>(
            <div key={title} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-bold text-white">{title}</div>
              <div className="text-gray-400 text-sm mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;