// src/pages/index.js

"use client";

import { useState, useEffect } from 'react';
import { firestore } from '../utils/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import Layout from '../components/Layout';

const HomePage = () => {
  const [recentLists, setRecentLists] = useState([]);

  useEffect(() => {
    const fetchRecentLists = async () => {
      try {
        const q = query(collection(firestore, 'user_lists'), orderBy('createdAt', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        const fetchedLists = [];
        querySnapshot.forEach((doc) => {
          fetchedLists.push({ id: doc.id, ...doc.data() });
        });
        setRecentLists(fetchedLists);
      } catch (error) {
        console.error('Error fetching recent lists: ', error);
      }
    };

    fetchRecentLists();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Recently Created Watchlists</h1>
        <ul className="list-none p-0">
          {recentLists.map((list) => (
            <li key={list.id} className="flex items-center p-4 mb-4 rounded-xl shadow-dark-lg bg-white text-black">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{list.name} <span className="text-sm text-gray-500">by {list.username}</span></h2>
                <div className="flex flex-wrap">
                  {list.movies.slice(0, 5).map((movie) => (
                    <img key={movie.id} src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-12 h-auto mr-2 mb-2" />
                  ))}
                </div>
              </div>
              <button className="bg-customGreen text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-600 focus:outline-none">
                Add to My Lists
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default HomePage;
