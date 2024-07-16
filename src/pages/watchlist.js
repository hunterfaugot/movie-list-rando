// src/app/watchlist.js

"use client";

import Layout from '../components/Layout';
import SearchMovies from '../components/SearchMovies';
import { useState, useEffect } from 'react';
import { firestore, auth } from '../utils/firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../styles/Watchlist.module.css';

const Watchlist = () => {
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

  const handleAddMovie = async (movie) => {
    if (!user) return;

    try {
      await addDoc(collection(firestore, 'watchlist'), {
        uid: user.uid,
        title: movie.title,
        release_date: movie.release_date,
        tmdb_id: movie.id,
        poster_path: movie.poster_path,
        director: movie.credits.crew.find((member) => member.job === 'Director')?.name,
      });
      fetchWatchlist(user.uid);
    } catch (error) {
      alert('Error adding movie: ' + error.message);
    }
  };

  const handleRemoveMovie = async (movieId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(firestore, 'watchlist', movieId));
      fetchWatchlist(user.uid);
    } catch (error) {
      alert('Error removing movie: ' + error.message);
    }
  };

  const pickRandomMovie = () => {
    if (watchlist.length > 0) {
      const randomIndex = Math.floor(Math.random() * watchlist.length);
      alert(`You should watch: ${watchlist[randomIndex].title}`);
    } else {
      alert('Your watchlist is empty.');
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(watchlist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWatchlist(items);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.searchColumn}>
          <SearchMovies onAddMovie={handleAddMovie} />
        </div>
        <div className={styles.watchlistColumn}>
          <button onClick={pickRandomMovie} className={styles.randomButton}>Pick a Random Movie</button>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="watchlist">
              {(provided) => (
                <ul className={styles.watchlist} {...provided.droppableProps} ref={provided.innerRef}>
                  {watchlist.map((movie, index) => (
                    <Draggable key={movie.id} draggableId={movie.id} index={index}>
                      {(provided) => (
                        <li
                          className={styles.watchlistItem}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span className={styles.movieIndex}>{index + 1}. </span>
                          <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                          <div>
                            {movie.title} ({movie.release_date?.substring(0, 4)})
                            <p>Director: {movie.director}</p>
                            <button onClick={() => handleRemoveMovie(movie.id)}>Remove</button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </Layout>
  );
};

export default Watchlist;
