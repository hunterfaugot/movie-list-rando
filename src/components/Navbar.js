// src/components/Navbar.js

"use client";

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <Link href="/">Home</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/auth/signup">Signup</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/auth/login">Login</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/profile">Profile</Link>
        </li>
        <li style={styles.navItem}>
          <Link href="/watchlist">Watchlist</Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#fff',
    padding: '10px',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'space-around',
    margin: 0,
    padding: 0,
  },
  navItem: {
    color: '#fff',
  },
};

export default Navbar;
