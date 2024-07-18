"use client";

import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase';

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <nav className="navbar">
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <Link href="/" passHref>
            <span className="text-white cursor-pointer">Home</span>
          </Link>
          {user && (
            <>
              <Link href="/watchlist" passHref>
                <span className="text-white cursor-pointer">Watchlist</span>
              </Link>
              <Link href="/my-lists" passHref>
                <span className="text-white cursor-pointer">My Lists</span>
              </Link>
            </>
          )}
        </div>
        <div className="flex space-x-4">
          {!user ? (
            <>
              <Link href="/auth/login" passHref>
                <span className="text-white border-2 border-white px-3 py-2 rounded-xl">Login</span>
              </Link>
              <Link href="/auth/signup" passHref>
                <span className="bg-white text-blue-500 border-2 border-white px-3 py-2 rounded-xl">Signup</span>
              </Link>
            </>
          ) : (
            <Link href="/profile" passHref>
              <span className="text-white border-2 border-white px-3 py-2 rounded-xl">Profile</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
