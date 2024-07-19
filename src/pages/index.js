"use client";

import { useState, useEffect } from 'react';
import { firestore, auth } from '../utils/firebase';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Layout from '../components/Layout';

const HomePage = () => {
  const [recentLists, setRecentLists] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchRecentLists = async () => {
      try {
        const q = query(collection(firestore, 'user_lists'), orderBy('createdAt', 'desc'));
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

  const handleAddToMyLists = async (list) => {
    if (!user) return;

    try {
      const newList = {
        uid: user.uid,
        name: list.name,
        movies: list.movies,
        createdAt: new Date(),
        username: user.displayName || user.email.split('@')[0] // Assuming you have a displayName or use email prefix as username
      };

      await addDoc(collection(firestore, 'user_lists'), newList);
      alert('List added to your lists successfully!');
    } catch (error) {
      console.error('Error adding list: ', error);
      alert('Error adding list: ' + error.message);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Recently Created Watchlists</h1>
        <ul className="list-none p-0">
          {recentLists.map((list) => (
            <li key={list.id} className="flex items-center p-4 mb-4 rounded-xl shadow-dark-lg bg-white text-black">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{list.name} <span className="text-sm text-gray-500">by {user && user.uid === list.uid ? 'You' : list.username}</span></h2>
                <div className="flex flex-wrap gap-2">
                  {list.movies.map((movie) => (
                    <img key={movie.id} src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-12 h-auto mb-2" />
                  ))}
                </div>
              </div>
              {user && user.uid !== list.uid && (
                <button
                  className="bg-customGreen text-white font-semibold py-2 px-4 rounded-xl hover:bg-green-600 focus:outline-none"
                  onClick={() => handleAddToMyLists(list)}
                >
                  Add to My Lists
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default HomePage;
