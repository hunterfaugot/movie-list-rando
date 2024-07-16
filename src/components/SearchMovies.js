// src/components/SearchMovies.js

"use client";

import { useState } from 'react';
import { searchMovies } from '../utils/tmdb';
import styles from '../styles/SearchMovies.module.css';

const SearchMovies = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      const movies = await searchMovies(query);
      setResults(movies);
    }
  };

  const renderMovieDetails = (movie) => {
    const director = movie.credits.crew.find((member) => member.job === 'Director');

    return (
      <div key={movie.id} className={styles.movieDetails}>
        <h3 className={styles.movieTitle}>{movie.title}</h3>
        <p>{movie.overview}</p>
        <p>Release Date: {movie.release_date}</p>
        <p>Director: {director ? director.name : 'N/A'}</p>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className={styles.moviePoster}
        />
        <button onClick={() => onAddMovie(movie)}>Add to Watchlist</button>
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {results.map((movie) => renderMovieDetails(movie))}
      </div>
    </div>
  );
};

export default SearchMovies;
