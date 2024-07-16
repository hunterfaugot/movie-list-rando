// src/components/SearchMovies.js

"use client";

import { useState } from 'react';
import { searchMovies } from '../utils/tmdb';

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
      <ul>
        {results.map((movie) => (
          <li key={movie.id}>
            {movie.title} ({movie.release_date?.substring(0, 4)})
            <button onClick={() => onAddMovie(movie)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchMovies;
