# PWA - MyMovies

## Project Overview

My Movies App is a cutting-edge Progressive Web Application (PWA) designed to offer a seamless movie browsing experience both online and offline. This application empowers users to search for movies, view detailed information, and enjoy a responsive, user-friendly interface regardless of their internet connectivity status.

### Key Features

- **Offline-First Approach:** Ensures functionality during offline use, leveraging service workers and caching strategies.
- **Dynamic Search Functionality:** Users can search for movies based on keywords and sort the results according to preferences like release date, popularity, or votes.
- **Detailed Movie Insights:** Access to comprehensive details of movies including a larger image, title, and other pertinent information.
- **PWA Compliance:** Fully installable application meeting all PWA criteria for enhanced user experience.
- **Custom Error Handling:** A tailored 404 error screen for unresolved queries or non-cachable content.

## Technical Specifications

### App Screens

1. **Home Screen:** Presents a search form with input for keywords, sorting preferences, and a submission button.
2. **Search Results Screen:** Displays search results as list tiles, each containing a movie's thumbnail image, title, and an icon.
3. **Cache Results Screen:** Similar to the search results screen but exclusively features cached movies.
4. **Movie Details Screen:** Offers an expanded view with detailed information about the selected movie.
5. **Custom 404 Error Screen:** Serves a user-friendly error page for non-existent or inaccessible content.

### Functionality Details

- **Search and Sorting:** The home screen's form captures user input for keywords and sorting preferences, redirecting to the search results page with query string parameters.
- **Offline Capability and Caching:** Service workers facilitate offline access to static files and cached movie details. The application intelligently switches to a cache results page when offline, utilizing cached data for search results.
- **API Integration:** The search results and movie details pages interact with a custom API (developed for MAD9124), fetching movie data when online. All fetched movie details are cached for offline access.
- **Navigation and Data Handling:** Users navigate to the movie details screen by selecting a list tile, carrying the movie ID through the query string for API calls or cache retrieval.

### Development Requirements

- Implement service worker logic for offline functionality, caching strategies for movie images/details, and dynamic data fetching from the custom API.
- Ensure responsive design principles are applied for an optimal user experience across various devices.
- Adhere to PWA criteria to enable app installation and offline usability.
- Develop a custom 404 error screen, ensuring it is cached and served appropriately for unresolved paths or when offline.

### Installation and Setup

- Clone the repository to your local machine.
- Ensure you have a web server environment set up (e.g., Apache, Nginx) or use a development server (e.g., `http-server` in Node.js).
- Configure service workers and test the application in a modern browser to verify PWA functionalities.
- Detailed setup instructions and dependencies will be provided in the project's `package.json` file.

### Example Usage of my colors scheme

- **Backgrounds:** Use Dark Blue `#0A192F` for the app's primary background and Light Grey `#F1FAEE` for content cards or sections.
- **Text:** Use Midnight Blue `#1D3557` for primary text on light backgrounds and Sky Blue `#48CAE4` or white for text on dark backgrounds.
- **Interactive Elements/CTAs:** Use Crimson Red `#E63946` for buttons and interactive elements, ensuring they stand out.
- **Highlights:** Use Yellow `#FFD60A` for highlighting important information or notifications within the app.

### Author:

Rocien Nkunga
