// src/utils/withAuth.js

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from './firebase';

const withAuth = (Component) => {
  const Auth = (props) => {
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          router.push('/auth/login');
        }
      });

      return () => unsubscribe();
    }, [router]);

    return <Component {...props} />;
  };

  Auth.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;

  return Auth;
};

export default withAuth;
