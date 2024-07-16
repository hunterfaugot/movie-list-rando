// src/app/page.js

"use client";

import Head from 'next/head';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <Head>
          <title>Home Page</title>
        </Head>
        <h1 className="text-3xl font-bold underline">Welcome to the Home Page</h1>
        <p className="mt-4 text-lg">
          This is the home page of your Next.js application styled with Tailwind CSS.
        </p>
      </div>
    </Layout>
  );
}
