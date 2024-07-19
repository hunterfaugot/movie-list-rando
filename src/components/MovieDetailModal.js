// src/components/MovieDetailModal.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieWatchProviders from './MovieWatchProviders';

const MovieDetailModal = ({ show, onClose, movie }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    if (!movie || !apiKey) return;

    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.tmdb_id}?api_key=${apiKey}&append_to_response=credits`);
        setMovieDetails(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error.message);
      }
    };

    fetchMovieDetails();
  }, [movie.tmdb_id, apiKey]);

  if (!show || !movieDetails) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black opacity-50 absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 shadow-lg relative z-10 max-w-md mx-auto text-black">
        <h2 className="text-lg font-semibold mb-4">{movieDetails.title}</h2>
        <img src={`https://image.tmdb.org/t/p/w200${movieDetails.poster_path}`} alt={movieDetails.title} className="mb-4" />
        <p><strong>Director:</strong> {movieDetails.credits.crew.find(member => member.job === 'Director')?.name}</p>
        <p><strong>Cast:</strong> {movieDetails.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
        <p className="mb-4"><strong>Summary:</strong> {movieDetails.overview}</p>
        <MovieWatchProviders movieId={movie.tmdb_id} />
        <button
          onClick={onClose}
          className="mt-4 py-2 px-4 bg-gray-300 text-black rounded-lg hover:bg-gray-400 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MovieDetailModal;
