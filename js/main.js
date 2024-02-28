// This is the registration of the Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
}

// Adding event listeners on the form
document.querySelector('.search-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Preventing the default form submission behavior

  // Here i am getting the search keyword and sort preference from the form in html
  const inputKeyword = document.getElementById('search').value;
  const sortPreference = document.getElementById('sort-preference').value;

  // This updating the URL in the browser without reloading the page
  const updatedUrl = `${window.location.protocol}//${window.location.host}${
    window.location.pathname
  }?keyword=${encodeURIComponent(inputKeyword)}&sort=${encodeURIComponent(sortPreference)}`;
  window.history.pushState({ path: updatedUrl }, '', updatedUrl);

  // Fetch movies and display them, basically i passed both IDs as parameters to be linked to the getMovies parameters"
  // Cause the keyword and sort preference are part of query string
  getMovies(inputKeyword, sortPreference);
});

// Listening for popstate events to handle browser navigation
window.addEventListener('popstate', function (event) {
  // Extract the search parameters from the URL
  let currentUrlParams = new URLSearchParams(window.location.search);
  let keyword = currentUrlParams.get('keyword');
  let sort = currentUrlParams.get('sort');

  // update your search inputs with these values
  document.getElementById('search').value = keyword || '';
  document.getElementById('sort-preference').value = sort || '';
});

// Function to fetch movies from my MovieDB
async function getMovies(searchKeyword, sortByPreference) {
  // Fetch the movies from my MovieDB API then add it to the list on the page.
  const baseUrl = 'https://moviedb-server-m35e.onrender.com/api';
  const url = `${baseUrl}/${sortByPreference}?keyword=${encodeURIComponent(searchKeyword)}`; // Here i get the baseUrl and add the

  // I use the fetch API with .then() and .catch() for handling the promise
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // If the response is not OK will throw an error
      }
      return response.json(); // Parse JSON from the response body
    })
    .then((data) => {
      displayMovies(data); // Pass the array directly to displayMovies
      displayResults(); // I am calling the displayResults function to hide form and only show results elements
    })
    .catch((error) => {
      console.error('Could not fetch movies:', error);
    });
}

// Function to display movies on the webpage, It takes an array of movie objects as its parameter.
function displayMovies(movies) {
  const list = document.getElementById('movielist'); // Get the DOM element with the ID 'movielist'. This is where i will display the movies.

  list.innerHTML = ''; // Clear out the inner HTML of the movie list element. I use this to remove any previously displayed movies.

  // Iterate over each movie object in the 'movies' array passed to the function.
  movies.forEach((movie) => {
    const movieCard = document.createElement('div'); // Here creating a new div element for each movie, which will act as a card.
    movieCard.classList.add('movie-card'); // Apply a class for styling, I will define .movie-card in my CSS with display: flex

    const posterBaseUrl = 'https://image.tmdb.org/t/p/w500'; // Using this to define the base URL for the movie poster images, This URL is combined with the specific movie's poster path.

    // Used this to display the default thumbnail if the movie url does not have one
    const posterUrl = movie.poster_path
      ? posterBaseUrl + movie.poster_path
      : '/img/default-thumbnail.png';

    // Setting the inner HTML of the list item, basically includes an <img> element for the movie's poster and an <h3> element for the movie's title.
    // I use the 'movie.poster_path' and 'movie.title' as they are properties of the movie object, representing the path to the movie's poster image and the title of the movie.
    movieCard.innerHTML = `
      <div class="movie-thumbnail">
        <img src="${posterUrl}">
      </div>
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <i class="fas fa-film movie-icon"></i>
      </div>
    `;

    // Adding event listeners for the movie card to be clicked
    movieCard.addEventListener('click', function () {
      getMovieDetails(movie.id);
    });

    // Appending the list item to the 'list' element, therefor adding it to the DOM and making it visible on my webpage.
    list.appendChild(movieCard);
  });
}

// Creating this function to do another fetch that will display only a single movie when clicked the movie card
// And only fetch that movie by id, i modified the query string to fetch by ID from my MovieDB server
async function getMovieDetails(movieId) {
  // Hide the result heading when the movie card is clicked
  document.querySelector('#results-heading').style.display = 'none';
  // Construct the new URL path for the movie details
  const movieDetailsUrl = `https://moviedb-server-m35e.onrender.com/api/id/${movieId}`;

  // Update the browser's address bar to reflect the movie ID
  // This just simply changes the URL displayed in the browser
  window.history.pushState({ path: `index.html?id=${movieId}` }, '', `index.html?id=${movieId}`);

  // Hide the h2 when the movie card is clicked
  document.querySelector('#results-heading').style.display = 'none';

  // Using try and catch to handle errors
  try {
    const response = await fetch(movieDetailsUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const movieDetails = await response.json();

    // Display the movie details on the page
    DisplayMovieDetails(movieDetails);
  } catch (error) {
    console.error('Unable to display the movie details:', error);
  }
}

// This is where the movie is displayed
function DisplayMovieDetails(movieDetails) {
  const list = document.getElementById('movielist'); // I call the movielist ID from my html to pass it as a value of my list variable
  list.innerHTML = ''; // This clear current content

  // Did the same here again added the defailt path for the movies that don't have thumbnail from my API
  const posterBaseUrl = 'https://image.tmdb.org/t/p/w500';
  const defaultPoster = '/img/default-thumbnail.png';
  const posterUrl = movieDetails.poster_path
    ? posterBaseUrl + movieDetails.poster_path
    : defaultPoster;

  // Adding elements to the clickedMovie variable so that can display when movie is clicked
  const clickedMovie = `
    <div class="movie-details">
      <h2>${movieDetails.title}</h2>
      <div class="movie-thumbnail-details">
        <img src="${posterUrl}">
      </div>
      <p><strong>Release Date:</strong> ${movieDetails.release_date}</p>
      <p>${movieDetails.overview}</p>
    </div>
  `;

  list.innerHTML = clickedMovie; // Passing the clickedMovie as a value of my list variable

  // Added this button to get back to my movie list (This was not required but added it for better user experience)
  const backToListButton = document.createElement('button');
  backToListButton.textContent = 'Back to list';
  backToListButton.classList.add('back-list', 'btn');
  backToListButton.onclick = () => {
    getMovies(
      document.getElementById('search').value,
      document.getElementById('sort-preference').value
    );
  };

  list.appendChild(backToListButton);
}

// This function to hide the search form and display a "Search Results" heading and "Back home" link to bring the user back to the homepage
function displayResults() {
  // Hide the search form
  document.querySelector('.search-form').style.display = 'none';

  let container = document.querySelector('.list-items'); // Targeting the .list-items class from my html

  // Creating or select the results heading
  let resultsHeading = document.getElementById('results-heading');
  if (!resultsHeading) {
    resultsHeading = document.createElement('h2'); // Creating h2 element
    resultsHeading.id = 'results-heading'; // And also created its ID
    resultsHeading.textContent = 'Search Results';
    container.parentNode.insertBefore(resultsHeading, container); // Inserting before the .list-items container
  }

  // Creating or select the back link
  let backHome = document.getElementById('back-home');
  if (!backHome) {
    backHome = document.createElement('a');
    backHome.id = 'back-home';
    backHome.href = '/index.html'; // This is the path to the html file for reload purposes
    backHome.textContent = 'Back home';
    backHome.addEventListener('click', function () {
      document.location.reload(true); // This will reload the page once the anchor is clicked
    });
    container.parentNode.insertBefore(backHome, container); // Inserting before the .list-items container
  }

  // Adjusting styles to make the results heading and back home visible if they were previously hidden
  resultsHeading.style.display = 'block';
  backHome.style.display = 'block';
}
