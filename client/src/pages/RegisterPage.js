import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🚀</div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-1">Join SB Stocks today</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['Name','text','name','Your name'],['Email','email','email','you@email.com'],['Password','password','password','••••••••']].map(([label,type,key,ph])=>(
            <div key={key}>
              <label className="text-gray-400 text-sm mb-1 block">{label}</label>
              <input type={type} required value={form[key]}
                onChange={e => setForm({...form, [key]: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                placeholder={ph}/>
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Have an account? <Link to="/login" className="text-green-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;