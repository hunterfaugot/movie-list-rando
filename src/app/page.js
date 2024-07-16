// src/app/page.js

"use client";

import Layout from '../components/Layout';
import TestFirebaseConfig from '../pages/auth/TestFirebaseConfig';

const HomePage = () => {
  return (
    <Layout>
      <h1>Home Page</h1>
      <TestFirebaseConfig />
    </Layout>
  );
};

export default HomePage;
