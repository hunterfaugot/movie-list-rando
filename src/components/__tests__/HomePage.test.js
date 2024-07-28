import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../../pages/index';
import { getDocs } from 'firebase/firestore';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  addDoc: jest.fn(),
}));

// Mock data for getDocs
const mockQuerySnapshot = {
  forEach: (callback) => {
    const docs = [
      { id: '1', data: () => ({ name: 'List 1', movies: [], createdAt: new Date(), username: 'user1', uid: '123' }) },
      { id: '2', data: () => ({ name: 'List 2', movies: [], createdAt: new Date(), username: 'user2', uid: '456' }) },
    ];
    docs.forEach(doc => callback(doc));
  },
};

// Update getDocs to return the mock data
getDocs.mockResolvedValue(mockQuerySnapshot);

test('renders Recently Created Watchlists heading', () => {
  render(<HomePage />);
  const headingElement = screen.getByText(/Recently Created Watchlists/i);
  expect(headingElement).toBeInTheDocument();
});
