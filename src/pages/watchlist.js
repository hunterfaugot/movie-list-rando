// src/app/watchlist.js

"use client";

import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { firestore, auth } from '../utils/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const Watchlist = () => {
  const [movie, setMovie] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchWatchlist(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(firestore, 'watchlist'), {
        uid: user.uid,
        name: movie,
      });
      setMovie('');
      fetchWatchlist(user.uid);
    } catch (error) {
      alert('Error adding movie: ' + error.message);
    }
  };

  const fetchWatchlist = async (uid) => {
    try {
      const q = query(collection(firestore, 'watchlist'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const movies = [];
      querySnapshot.forEach((doc) => {
        movies.push({ id: doc.id, ...doc.data() });
      });
      setWatchlist(movies);
    } catch (error) {
      alert('Error fetching watchlist: ' + error.message);
    }
  };

  const pickRandomMovie = () => {
    if (watchlist.length > 0) {
      const randomIndex = Math.floor(Math.random() * watchlist.length);
      alert(`You should watch: ${watchlist[randomIndex].name}`);
    } else {
      alert('Your watchlist is empty.');
    }
  };

  return (
    <Layout>
      <h1>Watchlist</h1>
      <form onSubmit={handleAddMovie}>
        <div>
          <label>Movie</label>
          <input
            type="text"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Movie</button>
      </form>
      <button onClick={pickRandomMovie}>Pick a Random Movie</button>
      <ul>
        {watchlist.map((movie) => (
          <li key={movie.id}>{movie.name}</li>
        ))}
      </ul>
    </Layout>
  );
};

export default Watchlist;
