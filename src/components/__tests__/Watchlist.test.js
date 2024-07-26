import React from 'react'; // Add this line
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Watchlist from '../../pages/watchlist';


jest.mock('../__mocks__/firebase');

test('renders Pick a Random Movie button', () => {
  render(<Watchlist />);
  const buttonElement = screen.getByText(/Pick a Random Movie/i);
  expect(buttonElement).toBeInTheDocument();
});
