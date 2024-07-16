// src/components/Layout.js

"use client";

import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#46237A] text-white">
      <nav className="bg-gray-800 p-4">
        <ul className="flex justify-around">
          <li>
            <Link href="/" passHref>
              <div className="text-white cursor-pointer">Home</div>
            </Link>
          </li>
          <li>
            <Link href="/watchlist" passHref>
              <div className="text-white cursor-pointer">Watchlist</div>
            </Link>
          </li>
          <li>
            <Link href="/auth/login" passHref>
              <div className="text-white cursor-pointer">Login</div>
            </Link>
          </li>
          <li>
            <Link href="/auth/signup" passHref>
              <div className="text-white cursor-pointer">Signup</div>
            </Link>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;

