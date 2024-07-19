import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieWatchProviders from './MovieWatchProviders';  // Add this line

const MovieDetailModal = ({ movie, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie.tmdb_id}`, {
          params: {
            api_key: apiKey,
            append_to_response: 'credits'
          }
        });
        setMovieDetails(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error.message);
      }
    };

    fetchMovieDetails();
  }, [movie.tmdb_id, apiKey]);

  if (!movieDetails) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black opacity-50 absolute inset-0"></div>
      <div className="bg-white rounded-lg p-6 shadow-lg relative z-10 max-w-lg mx-auto">
        <button onClick={onClose} className="absolute top-2 right-2 py-2 px-4 bg-customRed text-white rounded-lg hover:bg-red-700 focus:outline-none">
          Close
        </button>
        <div className="text-black">
          <img src={`https://image.tmdb.org/t/p/w200${movieDetails.poster_path}`} alt={movieDetails.title} className="w-full mb-4 rounded" />
          <h2 className="text-2xl font-bold mb-2">{movieDetails.title}</h2>
          <p><strong>Release Date:</strong> {movieDetails.release_date}</p>
          <p><strong>Summary:</strong> {movieDetails.overview}</p>
          <p><strong>Director:</strong> {movieDetails.credits.crew.find(member => member.job === 'Director')?.name}</p>
          <p><strong>Cast:</strong> {movieDetails.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
          <MovieWatchProviders movieId={movie.tmdb_id} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetailModal;
