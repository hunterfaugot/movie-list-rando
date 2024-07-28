// src/pages/search.js

import React, { useState } from 'react';
import { searchMovies } from '../utils/tmdb';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const movies = await searchMovies(query);
      setResults(movies);
    } catch (error) {
      console.error('Error searching for movies:', error);
    }
  };

  return (
    <div>
      <h1>Search Movies</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie"
          required
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
