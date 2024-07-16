// src/pages/watchlist.js

import { useState, useEffect } from 'react';
import { firestore } from '../utils/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const Watchlist = () => {
  const [movie, setMovie] = useState('');
  const [watchlist, setWatchlist] = useState([]);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(firestore, 'watchlist'), { name: movie });
      setMovie('');
      fetchWatchlist();
    } catch (error) {
      alert('Error adding movie: ' + error.message);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'watchlist'));
      const movies = [];
      querySnapshot.forEach((doc) => {
        movies.push({ id: doc.id, ...doc.data() });
      });
      setWatchlist(movies);
    } catch (error) {
      alert('Error fetching watchlist: ' + error.message);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <div>
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
      <ul>
        {watchlist.map((movie) => (
          <li key={movie.id}>{movie.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
