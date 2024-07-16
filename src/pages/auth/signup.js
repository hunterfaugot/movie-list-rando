// src/pages/auth/signup.js

"use client";

import { useState } from 'react';
import { auth } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Layout from '../../components/Layout';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Signup successful');
    } catch (error) {
      alert('Error signing up: ' + error.message);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-gray-900">
          <h1 className="text-2xl font-bold mb-6">Signup</h1>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
