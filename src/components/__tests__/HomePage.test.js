import React from 'react'; // Ensure React is imported
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../../pages/index';
import { useAuthState } from 'react-firebase-hooks/auth';

jest.mock('../../utils/firebase', () => {
  return {
    auth: {
      onAuthStateChanged: jest.fn(),
    },
    db: {},
  };
});

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

describe('HomePage', () => {
  beforeEach(() => {
    useAuthState.mockReturnValue([null, false]);
  });

  test('renders Home link', () => {
    render(<HomePage />);
    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
  });
});
