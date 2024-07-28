# Movie List Rando

Movie List Rando is a web application that allows users to create a personalized watchlist of movies. Users can add, remove, rate, and mark movies as watched or unwatched. The application fetches movie details from The Movie Database (TMDb) API and provides a detailed view of each movie.

## Features

- **User Authentication**: Users can sign in using their credentials.
- **Watchlist Management**: Users can create and manage their watchlists.
- **Search Movies**: Users can search for movies and add them to their watchlist.
- **Movie Details**: Detailed view of movies including title, release date, summary, director, and cast.
- **Rating**: Users can rate movies in their watchlist.
- **Watched Status**: Mark movies as watched or unwatched.
- **Random Movie Picker**: Pick a random movie from the watchlist.
- **Drag and Drop**: Reorder movies in the watchlist using drag and drop.
- **Save Lists**: Save and manage multiple watchlists.

## Tech Stack

- **Frontend**: React, Next.js
- **Backend**: Firebase Authentication, Firestore
- **API**: TMDb API
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
git clone https://github.com/your-username/movie-list-rando.git
cd movie-list-rando

2. Install the dependencies:
npm install
Set up environment variables:

3. Set up environment variables:
Create a .env.local file in the root directory and add the following variables:
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

4. Start the development server:
npm run dev

5. Open your browser and navigate to http://localhost:3000.

### Usage
Sign In: Use the sign-in option to authenticate.
Search Movies: Use the search bar to find movies and add them to your watchlist.
Manage Watchlist: View your watchlist, mark movies as watched, rate them, or remove them.
Movie Details: Click on a movie to view its details.
Random Movie: Use the "Pick a Random Movie" button to randomly select a movie from your watchlist.
Save Lists: Save your current watchlist or create a new one.

### Tests
To run the tests, use the following command:
npm test

### Contributing
1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -m 'Add some feature').
4. Push to the branch (git push origin feature-branch).
5. Open a pull request.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Acknowledgements
The Movie Database (TMDb) for providing the movie data.
Firebase for authentication and database services.
React Beautiful DnD for drag-and-drop functionality.

### Contact
For any inquiries or feedback, please contact your-email@example.com.

