"use client";

import React, { useState } from 'react';
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
      <li key={movie.id} className="flex items-center p-4 mb-4 rounded-xl shadow-dark-lg bg-white text-black">
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          className="w-16 h-auto mr-4"
        />
        <div className="flex-1">
          <div className="font-bold">{movie.title}</div> ({movie.release_date?.substring(0, 4)})
          <p>{movie.overview}</p>
          <p>Director: {director ? director.name : 'N/A'}</p>
          <button onClick={() => onAddMovie(movie)} className="ml-2 py-2 px-4 bg-customGreen text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Add to Watchlist
          </button>
        </div>
      </li>
    );
  };

  return (
    <div className="pb-4"> {/* Added padding-bottom */}
      <div className="sticky top-0 bg-customPurple z-10 p-4">
        <form onSubmit={handleSearch} className="flex mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie"
            className="flex-grow px-3 py-2 border rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-black placeholder-black"
          />
          <button type="submit" className="ml-2 py-2 px-4 bg-customGreen text-white font-semibold rounded-r-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Search
          </button>
        </form>
      </div>
      <ul className="list-none p-0">
        {results.map((movie) => renderMovieDetails(movie))}
      </ul>
    </div>
  );
};

export default SearchMovies;