import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from '../components/Modal'; // Ensure the path is correct
import { firestore, auth } from '../utils/firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import Layout from '../components/Layout';

const MyLists = () => {
  const [lists, setLists] = useState([]);
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserLists(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserLists = async (uid) => {
    try {
      const q = query(collection(firestore, 'user_lists'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      const fetchedLists = [];
      querySnapshot.forEach((doc) => {
        fetchedLists.push({ id: doc.id, ...doc.data() });
      });
      setLists(fetchedLists);
    } catch (error) {
      alert('Error fetching lists: ' + error.message);
    }
  };

  const handleEditList = (listId) => {
    router.push({
      pathname: '/watchlist',
      query: { listId: listId }
    });
  };

  const handleDeleteList = (listId) => {
    setListToDelete(listId);
    setShowDeleteModal(true);
  };

  const confirmDeleteList = async () => {
    if (!listToDelete) return;

    try {
      await deleteDoc(doc(firestore, 'user_lists', listToDelete));
      fetchUserLists(user.uid);
      setShowDeleteModal(false);
      setListToDelete(null);
      alert('List deleted successfully!');
    } catch (error) {
      alert('Error deleting list: ' + error.message);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Lists</h1>
        <ul className="list-none p-0">
          {lists.map((list) => (
            <li key={list.id} className="flex items-center p-4 mb-4 rounded-xl shadow-dark-lg bg-white text-black">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{list.name}</h2>
                <div className="flex flex-wrap">
                  {list.movies.slice(0, 5).map((movie) => (
                    <img key={movie.id} src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-12 h-auto mr-2 mb-2" />
                  ))}
                </div>
              </div>
              <button onClick={() => handleEditList(list.id)} className="ml-2 py-2 px-4 bg-customGreen text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Edit
              </button>
              <button onClick={() => handleDeleteList(list.id)} className="ml-2 py-2 px-4 bg-customRed text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteList}
        title="Delete List Confirmation"
        message="Are you sure you want to delete this list? This action cannot be undone."
      />
    </Layout>
  );
};

export default MyLists;
