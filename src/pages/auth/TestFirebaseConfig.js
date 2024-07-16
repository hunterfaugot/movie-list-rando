// src/app/auth/TestFirebaseConfig.js

"use client";

import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from '../../utils/firebase';

const TestFirebaseConfig = () => {
  useEffect(() => {
    console.log("Testing Firebase Initialization");
    const testApp = initializeApp(firebaseConfig, 'testApp');
    const testAuth = getAuth(testApp);
    console.log("Firebase Initialized:", testApp);
  }, []);

  return <div>Check console for Firebase Initialization</div>;
};

export default TestFirebaseConfig;
