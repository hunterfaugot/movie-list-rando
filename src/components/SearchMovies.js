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
      <li key={movie.id} className={styles.searchItem}>
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          className={styles.moviePoster}
        />
        <div className={styles.movieDetails}>
          <span className={styles.movieTitle}>{movie.title}</span> ({movie.release_date?.substring(0, 4)})
          <p>{movie.overview}</p>
          <p>Director: {director ? director.name : 'N/A'}</p>
          <button onClick={() => onAddMovie(movie)} className={styles.addButton}>Add to Watchlist</button>
        </div>
      </li>
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
      <ul className={styles.searchResults}>
        {results.map((movie) => renderMovieDetails(movie))}
      </ul>
    </div>
  );
};

export default SearchMovies;
