const inputMovie = document.getElementById("inputmovie");
const moviesList = document.querySelector(".movies-list");
const myListButton = document.querySelector("#my-list");
const watchButtons = document.querySelectorAll(".btn-assistir");
const searchIcon = document.getElementById("search-icon");

searchIcon.addEventListener("click", fetchMovies);
inputMovie.addEventListener("keyup", (e) => {
  if (e.key === "Enter") fetchMovies();
});

async function fetchMovies() {
  const query = inputMovie.value.trim().toLowerCase();
  if (!query) return;

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=748c8bacfdff03a69d854c2b198d6e30&query=${query}&language=en-US`
  );
  const data = await res.json();
  renderMovies(data.results);
}

function createMovieCard(movie) {
  const movieCard = document.createElement("li");
  movieCard.classList.add("movie");

  movieCard.appendChild(createMovieImage(movie));
  movieCard.appendChild(createMovieTitle(movie));
  movieCard.appendChild(createMovieRate(movie));
  movieCard.appendChild(createAddButton());
  return movieCard;
}

function createMovieImage(movie) {
  const movieImg = document.createElement("img");
  movieImg.src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "/img/NoImage.png";
  return movieImg;
}

function createMovieTitle(movie) {
  const movieTitle = document.createElement("h1");
  movieTitle.classList.add("movie-title");
  movieTitle.textContent = movie.title;
  return movieTitle;
}

function createMovieRate(movie) {
  const starRate = document.createElement("div");
  starRate.classList.add("star-rate");
  const rate = document.createElement("span");
  rate.textContent = movie.vote_average.toFixed(1);
  const imgRate = document.createElement("img");
  imgRate.src = "/img/star.svg";
  starRate.appendChild(imgRate);
  starRate.appendChild(rate);
  return starRate;
}

function createAddButton() {
  const button = document.createElement("button");
  button.classList.add("btn-assistir");
  const imgButton = document.createElement("img");
  imgButton.src = "/img/plus.svg";
  button.appendChild(imgButton);
  button.textContent = "Add To List";
  return button;
}

function renderMovies(movies) {
  moviesList.innerHTML = "";
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    moviesList.appendChild(card);
  });
}
