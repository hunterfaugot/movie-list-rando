// src/utils/tmdb.js

import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query,
        include_adult: false,
      },
    });

    // Fetch additional details for each movie
    const movieDetailsPromises = response.data.results.map(async (movie) => {
      const movieDetails = await getMovieDetails(movie.id);
      return { ...movie, ...movieDetails };
    });

    return await Promise.all(movieDetailsPromises);
  } catch (error) {
    console.error('Error fetching movies from TMDb:', error);
    return [];
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'credits',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details from TMDb:', error);
    return null;
  }
};
