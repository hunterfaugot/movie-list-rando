"use client";

import Layout from '../components/Layout';
import SearchMovies from '../components/SearchMovies';
import MovieWatchProviders from '../components/MovieWatchProviders';
import Modal from '../components/Modal';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { firestore, auth } from '../utils/firebase';
import { collection, addDoc, getDoc, getDocs, query, where, deleteDoc, doc, orderBy, writeBatch, updateDoc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [user, setUser] = useState(null);
  const [listName, setListName] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const router = useRouter();
  const { listId } = router.query; // Extract listId from query parameters

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        if (listId) {
          fetchList(listId); // Fetch list if listId is present
        } else {
          fetchWatchlist(user.uid); // Otherwise, fetch watchlist
        }
      }
    });

    return () => unsubscribe();
  }, [listId]); // Add listId as dependency

  const fetchWatchlist = async (uid) => {
    try {
      const q = query(collection(firestore, 'watchlist'), where('uid', '==', uid), orderBy('order'));
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

  const fetchList = async (id) => {
    try {
      const docRef = doc(firestore, 'user_lists', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const listData = docSnap.data();
        setListName(listData.name);
        setWatchlist(listData.movies
          .map((movie) => ({
            ...movie,
            id: movie.id ? movie.id.toString() : 'no-id', // Ensure unique ID
            order: movie.order // Ensure the order is maintained
          }))
          .sort((a, b) => a.order - b.order) // Sort by order
        );
      } else {
        alert('List not found.');
      }
    } catch (error) {
      alert('Error fetching list: ' + error.message);
    }
  };

  const handleAddMovie = async (movie) => {
    if (!user) return;

    try {
      const order = watchlist.length + 1; // Next order number
      await addDoc(collection(firestore, 'watchlist'), {
        uid: user.uid,
        title: movie.title,
        release_date: movie.release_date,
        tmdb_id: movie.id,
        poster_path: movie.poster_path,
        director: movie.credits.crew.find((member) => member.job === 'Director')?.name,
        order: order,
        watched: false // Default to not watched
      });
      fetchWatchlist(user.uid);
      setHasUnsavedChanges(true); // Set unsaved changes to true
    } catch (error) {
      alert('Error adding movie: ' + error.message);
    }
  };

  const handleRemoveMovie = async (movieId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(firestore, 'watchlist', movieId));
      fetchWatchlist(user.uid);
      setHasUnsavedChanges(true); // Set unsaved changes to true
    } catch (error) {
      alert('Error removing movie: ' + error.message);
    }
  };

  const handleToggleWatched = async (movieId, watched) => {
    try {
      await updateDoc(doc(firestore, 'watchlist', movieId), { watched: !watched });
      fetchWatchlist(user.uid);
      setHasUnsavedChanges(true); // Set unsaved changes to true
    } catch (error) {
      alert('Error updating movie: ' + error.message);
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
        username: user.displayName || "Anonymous", // Assuming user object has a displayName field
        name: listName,
        movies: watchlist.map((movie, index) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          tmdb_id: movie.tmdb_id,
          poster_path: movie.poster_path,
          director: movie.director,
          watched: movie.watched,
          order: index // Save the order
        })),
        createdAt: new Date() // Add timestamp
      };
  
      await addDoc(collection(firestore, 'user_lists'), listData);
      alert('List saved successfully!');
      setHasUnsavedChanges(false); // Reset unsaved changes
    } catch (error) {
      alert('Error saving list: ' + error.message);
    }
  };
  

  const updateList = async () => {
    if (!user || !listId) return;

    try {
      const batch = writeBatch(firestore);

      // Update watchlist collection
      const promises = watchlist.map(async (movie, index) => {
        const docRef = doc(firestore, 'watchlist', movie.id.toString());
        console.log(`Checking document existence for ID: ${movie.id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          batch.update(docRef, { order: index });
          console.log(`Updating document ${movie.id} with order ${index}`);
        } else {
          console.error(`Document ${movie.id} does not exist`);
        }
      });

      // Update user_lists collection
      const listDocRef = doc(firestore, 'user_lists', listId);
      batch.update(listDocRef, {
        movies: watchlist.map((movie, index) => ({
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          tmdb_id: movie.tmdb_id,
          poster_path: movie.poster_path,
          director: movie.director,
          watched: movie.watched,
          order: index // Save the order
        }))
      });

      await Promise.all(promises);
      await batch.commit();

      console.log('List updated successfully!');
      setHasUnsavedChanges(false); // Reset unsaved changes
      alert('List updated successfully!');
    } catch (error) {
      console.error('Error updating list in Firestore:', error);
      alert('Error updating list: ' + error.message);
    }
  };

  const clearList = async () => {
    if (!user || !listId) return;

    setShowClearModal(true);
  };

  const confirmClearList = async () => {
    try {
      const batch = writeBatch(firestore);
      watchlist.forEach((movie) => {
        const docRef = doc(firestore, 'watchlist', movie.id.toString());
        batch.delete(docRef);
      });

      const listDocRef = doc(firestore, 'user_lists', listId);
      batch.update(listDocRef, { movies: [] });

      await batch.commit();

      setWatchlist([]);
      setHasUnsavedChanges(false);
      setShowClearModal(false);
      alert('List cleared successfully!');
    } catch (error) {
      console.error('Error clearing list in Firestore:', error);
      alert('Error clearing list: ' + error.message);
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

    setWatchlist(items); // Update local state first
    setHasUnsavedChanges(true); // Set unsaved changes to true
  };

  return (
    <Layout>
      <div className="flex justify-between p-4 h-screen overflow-hidden">
        <div className="flex-1 mr-4 overflow-y-auto pb-6">
          <SearchMovies onAddMovie={handleAddMovie} />
        </div>
        <div className="flex-1 ml-4 flex flex-col overflow-y-auto pb-10">
          <div className="sticky top-0 z-10 p-4 flex items-center bg-white">
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
            {hasUnsavedChanges && (
              <button onClick={updateList} className="ml-2 py-2 px-4 bg-customGreen text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Update List
              </button>
            )}
            <button onClick={clearList} className="ml-auto py-2 px-4 bg-customRed text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
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
                          className="flex flex-col p-4 mb-4 rounded-xl shadow-dark-lg bg-white text-black"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="flex items-center">
                            <span className="font-bold mr-4">{index + 1}. </span>
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-12 h-auto mr-4" />
                            <div className="flex-1">
                              {movie.title} ({movie.release_date?.substring(0, 4)})
                              <p>Director: {movie.director}</p>
                              <label className="flex items-center ml-4">
                                <input
                                  type="checkbox"
                                  checked={movie.watched}
                                  onChange={() => handleToggleWatched(movie.id, movie.watched)}
                                  className="mr-2"
                                />
                                Watched
                              </label>
                              <button onClick={() => handleRemoveMovie(movie.id)} className="ml-2 py-2 px-4 bg-customRed text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                Remove
                              </button>
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
      <Modal 
        show={showClearModal} 
        onClose={() => setShowClearModal(false)} 
        onConfirm={confirmClearList} 
        title="Clear List Confirmation" 
        message="Are you sure you want to clear the list? This action cannot be undone." 
      />
    </Layout>
  );
};

export default Watchlist;

