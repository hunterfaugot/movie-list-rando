import { useState, useEffect } from 'react';
import { firestore, auth } from '../utils/firebase';
import { collection, getDocs, query, orderBy, limit, addDoc } from 'firebase/firestore';
import Layout from '../components/Layout';

const HomePage = () => {
  const [recentLists, setRecentLists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

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

  const handleAddToMyLists = async (list) => {
    if (!user) return;

    try {
      const listData = {
        uid: user.uid,
        name: list.name,
        movies: list.movies,
        createdAt: new Date(),
        username: user.displayName || user.email.split('@')[0], // assuming username is set during signup
      };

      await addDoc(collection(firestore, 'user_lists'), listData);
      alert('List added to your lists successfully!');
    } catch (error) {
      console.error('Error adding list to my lists: ', error);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Recently Created Watchlists</h1>
        <ul className="list-none p-0">
          {recentLists.map((list) => {
            console.log('User ID:', user?.uid, 'List UID:', list.uid); // Debug line

            return (
              <li key={list.id} className="flex items-center p-4 mb-4 rounded-xl shadow-dark-lg bg-white text-black">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {list.name} <span className="text-sm text-gray-500">by {list.username}</span>
                  </h2>
                  <div className="flex flex-wrap">
                    {list.movies.slice(0, 5).map((movie) => (
                      <img key={movie.id} src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-12 h-auto mr-2 mb-2" />
                    ))}
                  </div>
                </div>
                {user && list.uid !== user.uid && (
                  <button onClick={() => handleAddToMyLists(list)} className="ml-2 py-2 px-4 bg-customGreen text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    Add to My Lists
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export default HomePage;
