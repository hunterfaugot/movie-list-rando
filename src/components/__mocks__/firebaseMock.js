// src/__mocks__/firebaseMock.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar'; // Ensure this path is correct

// Mock Firebase configuration and initialization
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    name: '[DEFAULT]',
  })),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: '123',
      email: 'test@example.com',
    },
    onAuthStateChanged: jest.fn((callback) => {
      callback({
        uid: '123',
        email: 'test@example.com',
      });
      return () => {};
    }),
  })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    getDocs: jest.fn().mockResolvedValue({
      docs: [{ id: 1, data: () => ({ name: 'Document' }) }],
    }),
    addDoc: jest.fn().mockResolvedValue({ id: 123 }),
  })),
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('renders Home link', () => {
    render(<Navbar />);
    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
  });
});

