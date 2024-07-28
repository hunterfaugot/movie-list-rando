import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Watchlist from '../../pages/watchlist';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    onAuthStateChanged: jest.fn((callback) => {
      callback(null); // Simulate a null user to test unauthenticated state
    }),
    currentUser: {
      uid: '123',
      email: 'test@example.com',
    },
  })),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(() => [null]), // Simulate no authenticated user
}));

beforeEach(() => {
  useRouter.mockReturnValue({
    query: { listId: 'test-list-id' },
  });
});

test('renders Pick a Random Movie button', () => {
  render(<Watchlist />);
  const buttonElement = screen.getByText(/Pick a Random Movie/i);
  expect(buttonElement).toBeInTheDocument();
});
