import React from 'react';

const StarRating = ({ rating, onRatingChange }) => {
  const handleRatingChange = (newRating) => {
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => handleRatingChange(star)}
          className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 .587l3.668 7.568L24 9.753l-6 5.856 1.416 8.262L12 18.548l-7.416 5.323L6 15.609 0 9.753l8.332-1.598z"
          />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
