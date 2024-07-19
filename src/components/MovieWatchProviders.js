import React, { useState, useEffect } from 'react';
import axios from 'axios';

const popularProviders = [
  'Netflix',
  'Disney Plus',
  'Hulu',
  'Amazon Prime Video',
  'HBO Max'
];

const MovieWatchProviders = ({ movieId }) => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=cfa5bfcc1ef2a7ad945c5475e5c0ef3f` // Replace with your actual API key
        );
        console.log('API Response:', response.data);

        const results = response.data.results;
        const availableProviders = [];

        // Check for streaming providers in multiple regions
        for (const region in results) {
          console.log(`Region: ${region}, Providers: `, results[region]);
          if (results[region]?.flatrate) {
            availableProviders.push(...results[region].flatrate);
          }
        }

        // Log available providers before filtering
        console.log('Available Providers:', availableProviders);

        // Filter out duplicate providers and only include popular ones
        const uniqueProviders = [];
        const providerIds = new Set();
        for (const provider of availableProviders) {
          const normalizedProviderName = provider.provider_name.toLowerCase().trim();
          if (!providerIds.has(provider.provider_id) && popularProviders.map(p => p.toLowerCase().trim()).includes(normalizedProviderName)) {
            providerIds.add(provider.provider_id);
            uniqueProviders.push(provider);
          }
        }

        // Log filtered providers
        console.log('Filtered Providers:', uniqueProviders);

        setProviders(uniqueProviders);
      } catch (error) {
        console.error('Error fetching watch providers:', error);
      }
    };

    fetchProviders();
  }, [movieId]);

  return (
    <div>
      <br></br>
      {providers.length > 0 ? (
        <ul className="flex space-x-4">
          {providers.map((provider) => (
            <li key={provider.provider_id} className="flex flex-col items-center">
              <img src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`} alt={provider.provider_name} className="w-10 h-10" />
              
            </li>
          ))}
        </ul>
      ) : (
        <p>No streaming providers available. Visit the <a href={`https://www.themoviedb.org/movie/${movieId}/watch`} target="_blank" rel="noopener noreferrer">TMDb watch page</a> for more details.</p>
      )}
    </div>
  );
};

export default MovieWatchProviders;
