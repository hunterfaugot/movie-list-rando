// src/pages/profile.js

"use client";

import Layout from '../components/Layout';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, firestore } from '../utils/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username || '');
        } else {
          await setDoc(doc(firestore, 'users', user.uid), {
            email: user.email,
            username: '',
            createdAt: new Date()
          });
        }
        setLoading(false);
      } else {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/auth/login');
  };

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      alert('Username cannot be empty');
      return;
    }

    try {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, { username: username });
      await updateProfile(user, { displayName: username });
      alert('Username updated successfully');
    } catch (error) {
      console.error('Error updating username: ', error);
      alert('Error updating username: ' + error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-gray-900">
          <h1 className="text-2xl font-bold mb-6">Profile</h1>
          <p className="mb-4"><strong>Email:</strong> {user.email}</p>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleUpdateUsername}
            className="w-full py-2 px-4 mb-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Username
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
