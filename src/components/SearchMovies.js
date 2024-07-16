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

  const renderMovieDetails = (movie) => {
    const director = movie.credits.crew.find((member) => member.job === 'Director');

    return (
      <li key={movie.id} className="flex items-center p-4 mb-4 border border-gray-300 bg-white">
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          className="w-12 h-auto mr-4"
        />
        <div className="flex-1">
          <div className="font-bold">{movie.title}</div> ({movie.release_date?.substring(0, 4)})
          <p>{movie.overview}</p>
          <p>Director: {director ? director.name : 'N/A'}</p>
          <button onClick={() => onAddMovie(movie)} className="ml-2 btn btn-primary">Add to Watchlist</button>
        </div>
      </li>
    );
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie"
          className="input input-bordered"
        />
        <button type="submit" className="ml-2 btn btn-primary">Search</button>
      </form>
      <ul className="list-none p-0">
        {results.map((movie) => renderMovieDetails(movie))}
      </ul>
    </div>
  );
};

export default SearchMovies;
