// src/components/Layout.js

"use client";

import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#46237A] text-white">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
