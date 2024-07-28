import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieDetailModal from '../MovieDetailModal';
import axios from 'axios';

jest.mock('axios');

const movie = {
  title: 'Jurassic Park',
  tmdb_id: '123',
};

const movieDetails = {
  title: 'Jurassic Park',
  release_date: '1993-06-11',
  overview: 'A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park\'s cloned dinosaurs to run loose.',
  poster_path: '/poster.jpg',
  credits: {
    crew: [{ job: 'Director', name: 'Steven Spielberg' }],
    cast: [{ name: 'Sam Neill' }, { name: 'Laura Dern' }],
  },
};

describe('MovieDetailModal', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: movieDetails });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders movie title', async () => {
    render(<MovieDetailModal show={true} movie={movie} onClose={jest.fn()} />);
    const titleElement = await waitFor(() => screen.getByText('Jurassic Park'));
    expect(titleElement).toBeInTheDocument();
  });

  test('renders director name', async () => {
    render(<MovieDetailModal show={true} movie={movie} onClose={jest.fn()} />);
    const directorElement = await waitFor(() => screen.getByText(/Steven Spielberg/));
    expect(directorElement).toBeInTheDocument();
  });

  test('renders cast names', async () => {
    render(<MovieDetailModal show={true} movie={movie} onClose={jest.fn()} />);
    const castElement1 = await waitFor(() => screen.getByText(/Sam Neill/));
    const castElement2 = await waitFor(() => screen.getByText(/Laura Dern/));
    expect(castElement1).toBeInTheDocument();
    expect(castElement2).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(<MovieDetailModal show={false} movie={movie} onClose={jest.fn()} />);
    const modalElement = screen.queryByText('Jurassic Park');
    expect(modalElement).not.toBeInTheDocument();
  });
});
