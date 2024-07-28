"use client";

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SearchMovies from '../components/SearchMovies';
import MovieWatchProviders from '../components/MovieWatchProviders';
import MovieDetailModal from '../components/MovieDetailModal';
import StarRating from '../components/StarRating';
import { useRouter } from 'next/router';
import { firestore, auth } from '../utils/firebase';
import { collection, addDoc, getDoc, getDocs, query, where, deleteDoc, doc, orderBy, writeBatch, updateDoc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);
  const [listName, setListName] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const router = useRouter();
  const { listId } = router.query;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        if (listId) {
          fetchList(listId);
        } else {
          fetchWatchlist(user.uid);
        }
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [listId]);

  const fetchWatchlist = async (uid) => {
    try {
      const q = query(collection(firestore, 'watchlist'), where('uid', '==', uid), orderBy('order'));
      const querySnapshot = await getDocs(q);
      const movies = [];
      querySnapshot.forEach((doc) => {
        movies.push({ id: doc.id, ...doc.data() });
      });
      console.log('Fetched watchlist:', movies);
      setWatchlist(movies);
    } catch (error) {
      console.error('Error fetching watchlist:', error.message);
      alert('Error fetching watchlist: ' + error.message);
    }
  };

  const fetchList = async (id) => {
    try {
      const docRef = doc(firestore, 'user_lists', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const listData = docSnap.data();
        setListName(listData.name);
        setWatchlist(listData.movies.map((movie) => ({
          ...movie,
          id: movie.id ? movie.id.toString() : 'no-id',
          watched: movie.watched !== undefined ? movie.watched : false,
          rating: movie.rating !== undefined ? movie.rating : 0,
        })));
        console.log('Fetched list:', listData.movies);
      } else {
        alert('List not found.');
      }
    } catch (error) {
      console.error('Error fetching list:', error.message);
      alert('Error fetching list: ' + error.message);
    }
  };

  const handleAddMovie = async (movie) => {
    if (!user) return;

    try {
      const order = watchlist.length + 1;
      await addDoc(collection(firestore, 'watchlist'), {
        uid: user.uid,
        title: movie.title,
        release_date: movie.release_date,
        tmdb_id: movie.id,
        poster_path: movie.poster_path,
        director: movie.credits.crew.find((member) => member.job === 'Director')?.name,
        order: order,
        watched: false,
        rating: 0
      });
      fetchWatchlist(user.uid);
    } catch (error) {
      console.error('Error adding movie:', error.message);
      alert('Error adding movie: ' + error.message);
    }
  };

  const handleRemoveMovie = async (movieId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(firestore, 'watchlist', movieId));
      fetchWatchlist(user.uid);
    } catch (error) {
      console.error('Error removing movie:', error.message);
      alert('Error removing movie: ' + error.message);
    }
  };

  const handleToggleWatched = async (movieId, watched) => {
    try {
      await updateDoc(doc(firestore, 'watchlist', movieId), { watched: !watched });
      fetchWatchlist(user.uid);
    } catch (error) {
      console.error('Error updating movie:', error.message);
      alert('Error updating movie: ' + error.message);
    }
  };

  const handleRatingChange = async (movieId, rating) => {
    try {
      await updateDoc(doc(firestore, 'watchlist', movieId), { rating });
      fetchWatchlist(user.uid);
    } catch (error) {
      console.error('Error updating rating:', error.message);
      alert('Error updating rating: ' + error.message);
    }
  };

  const saveList = async () => {
    if (!user || !listName.trim()) {
      alert('Please enter a list name.');
      return;
    }
  
    try {
      const listData = {
        uid: user.uid,
        name: listName,
        movies: watchlist.map(movie => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          tmdb_id: movie.tmdb_id,
          poster_path: movie.poster_path,
          director: movie.director,
          watched: movie.watched,
          rating: movie.rating
        })),
        createdAt: new Date()
      };
  
      await addDoc(collection(firestore, 'user_lists'), listData);
      alert('List saved successfully!');
    } catch (error) {
      console.error('Error saving list:', error.message);
      alert('Error saving list: ' + error.message);
    }
  };

  const pickRandomMovie = () => {
    if (watchlist.length > 0) {
      const randomIndex = Math.floor(Math.random() * watchlist.length);
      setSelectedMovie(watchlist[randomIndex]);
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
    updateFirestoreOrder(items);
  };

  const updateFirestoreOrder = async (items) => {
    const batch = writeBatch(firestore);
    items.forEach((item, index) => {
      if (item.id) {
        const docRef = doc(firestore, 'watchlist', item.id.toString());
        batch.update(docRef, { order: index });
      }
    });
    try {
      await batch.commit();
    } catch (error) {
      console.error('Error updating order in Firestore:', error.message);
    }
  };

  const clearList = async () => {
    if (!user) return;

    try {
      for (const movie of watchlist) {
        await deleteDoc(doc(firestore, 'watchlist', movie.id));
      }
      setWatchlist([]);
      alert('List cleared successfully!');
    } catch (error) {
      console.error('Error clearing list:', error.message);
      alert('Error clearing list: ' + error.message);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between p-4 h-screen overflow-hidden">
        <div className="flex-1 mr-4 overflow-y-auto pb-6">
          <SearchMovies onAddMovie={handleAddMovie} />
        </div>
        <div className="flex-1 ml-4 flex flex-col overflow-y-auto pb-10">
          <div className="sticky top-0 z-10 p-4 flex items-center">
            <button onClick={pickRandomMovie} className="py-2 px-4 bg-customGreen text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Pick a Random Movie
            </button>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="List Name"
              className="ml-4 px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-black placeholder-black"
            />
            <button onClick={saveList} className="ml-2 py-2 px-4 bg-customGreen text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Save List
            </button>
            <button onClick={clearList} className="ml-2 py-2 px-4 bg-customRed text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Clear List
            </button>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="watchlist">
              {(provided) => (
                <ul className="list-none p-0" {...provided.droppableProps} ref={provided.innerRef}>
                  {watchlist.map((movie, index) => (
                    <Draggable key={movie.id} draggableId={String(movie.id)} index={index}>
                      {(provided) => (
                        <li
                          className="relative flex flex-col p-4 mb-4 rounded-xl shadow-dark-lg bg-white text-black"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <button onClick={() => handleRemoveMovie(movie.id)} className="absolute top-2 right-2 py-2 px-4 bg-customRed text-white font-semibold rounded-xl shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Remove
                          </button>
                          <div className="flex items-center mb-2">
                            <span className="font-bold mr-4">{index + 1}. </span>
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-16 h-auto mr-4" />
                            <div className="flex-1">
                              <span className="font-bold">{movie.title}</span> ({movie.release_date?.substring(0, 4)})
                              <p>Director: {movie.director}</p>
                              <div className="flex items-center mt-2">
                                <button
                                  onClick={() => handleToggleWatched(movie.id, movie.watched)}
                                  className={`ml-4 py-2 px-4 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    movie.watched ? 'border border-customGreen bg-customGreen text-white' : 'border border-customGreen bg-white text-black'
                                  }`}
                                >
                                  {movie.watched ? 'Watched' : 'Not Watched'}
                                </button>
                                <div className="ml-4">
                                  <StarRating
                                    rating={movie.rating}
                                    onRatingChange={(newRating) => handleRatingChange(movie.id, newRating)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <MovieWatchProviders movieId={movie.tmdb_id} />
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
      {selectedMovie && (
        <MovieDetailModal
          show={!!selectedMovie}
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </Layout>
  );
};

export default Watchlist;