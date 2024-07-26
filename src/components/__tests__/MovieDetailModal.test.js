import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieDetailModal from '../MovieDetailModal';

jest.mock('../__mocks__/firebase');

const movie = {
  title: 'Jurassic Park',
  credits: {
    crew: [{ job: 'Director', name: 'Steven Spielberg' }],
    cast: [{ name: 'Sam Neill' }, { name: 'Laura Dern' }],
  },
};

test('renders movie title', () => {
  render(<MovieDetailModal show={true} movie={movie} />);
  const titleElement = screen.getByText((content, element) => {
    return content.includes('Jurassic Park');
  });
  expect(titleElement).toBeInTheDocument();
});
