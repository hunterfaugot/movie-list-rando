import React from 'react'; // Add this line
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyLists from '../../pages/my-lists';


jest.mock('../__mocks__/firebase');

test('renders My Lists heading', () => {
  render(<MyLists />);
  const headingElement = screen.getByText(/My Lists/i);
  expect(headingElement).toBeInTheDocument();
});
