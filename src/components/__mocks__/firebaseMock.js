// src/components/__tests__/Navbar.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar'; // Ensure this path is correct and matches the casing
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
  })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

describe('Navbar', () => {
  beforeAll(() => {
    initializeApp(); // Ensure this is called before any test runs
  });

  test('renders Home link', () => {
    render(<Navbar />);
    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
  });
});

export const initializeApp = jest.fn();
export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn((callback) => {
    callback({
      uid: '123',
      email: 'test@example.com',
    });
    return () => {};
  }),
  currentUser: {
    uid: '123',
    email: 'test@example.com',
  },
}));
export const getFirestore = jest.fn();

