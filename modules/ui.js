import {
  state,
  isInList,
  addToList,
  removeFromList,
  getMovieById,
  currentView,
  setCurrentView,
} from "./state.js";

import { persistList } from "./storage.js";
import { fetchPopularMovies } from "./api.js";
import { renderMovieDetails } from "./moviedetails.js";

const moviesList = document.querySelector(".movies-list");
const h1text = document.getElementById("h1-text");

// =========================
// RENDER MOVIES
// =========================
export function renderMovies(movies) {
  moviesList.innerHTML = "";
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    moviesList.appendChild(card);
  });
}

// =========================
// RENDER LIST
// =========================
export function renderList() {
  moviesList.innerHTML = "";
  h1text.innerText = "Your List";

  const movies = Array.from(state.myList.values());

  if (movies.length === 0) {
    moviesList.innerHTML = "<p>Nenhum filme na sua lista ainda.</p>";

    const SearchMoviesBtn = document.createElement("button");
    SearchMoviesBtn.innerText = "Buscar Filmes";
    SearchMoviesBtn.classList.add("searchmoviebtn");
    moviesList.appendChild(SearchMoviesBtn);

    SearchMoviesBtn.addEventListener("click", () => {
      h1text.innerText = "Filmes Populares";
      fetchPopularMovies();
    });

    return;
  }

  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    moviesList.appendChild(card);
  });
}

// =========================
// CREATE MOVIE CARD
// =========================
export function createMovieCard(movie) {
  const movieCard = document.createElement("li");
  movieCard.classList.add("movie");
  movieCard.dataset.id = movie.id;

  movieCard.appendChild(createMovieImage(movie));

  const movieTexts = document.createElement("div");
  movieTexts.classList.add("movie-texts");
  movieTexts.appendChild(createMovieTitle(movie));
  movieTexts.appendChild(createMovieRate(movie));
  movieTexts.appendChild(createAddButton(movie));

  movieCard.appendChild(movieTexts);
  return movieCard;
}

// =========================
// CARD HELPERS
// =========================
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

  const imgRate = document.createElement("img");
  imgRate.src = "/img/star.svg";

  const rate = document.createElement("span");
  const safeRate = movie.vote_average
    ? Number(movie.vote_average).toFixed(1)
    : "N/A";
  rate.textContent = safeRate;

  starRate.appendChild(imgRate);
  starRate.appendChild(rate);
  return starRate;
}

function createAddButton(movie) {
  const button = document.createElement("button");
  button.classList.add("btn-assistir");

  const imgButton = document.createElement("img");
  const spanText = document.createElement("span");

  if (isInList(movie.id)) {
    imgButton.src = "/img/remove.svg";
    spanText.textContent = "Remove";
    button.classList.add("in-list");
  } else {
    imgButton.src = "/img/plus.svg";
    spanText.textContent = "Add to List";
  }

  button.appendChild(imgButton);
  button.appendChild(spanText);
  return button;
}

// =========================
// UPDATE BUTTON STATE
// =========================
export function updateButtonState(button, movieId) {
  if (isInList(movieId)) {
    button.classList.add("in-list");
    button.querySelector("img").src = "/img/remove.svg";
    button.querySelector("span").textContent = "Remove";
  } else {
    button.classList.remove("in-list");
    button.querySelector("img").src = "/img/plus.svg";
    button.querySelector("span").textContent = "Add to List";
  }
}

// =========================
// HANDLE BUTTON CLICKS
// =========================

moviesList.addEventListener("click", (e) => {
  if (e.target.closest(".btn-assistir")) return;

  const img = e.target.closest("img");
  if (!img) return;

  const movieCard = img.closest(".movie");
  if (!movieCard) return;

  const id = Number(movieCard.dataset.id);
  renderMovieDetails(id);
});

moviesList.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-assistir");
  if (!btn) return;

  const card = btn.closest(".movie");
  if (!card) return;

  const id = Number(card.dataset.id);
  const movie = getMovieById(id);
  if (!movie) return;

  if (isInList(id)) {
    removeFromList(id);
    persistList();

    if (currentView === "list") {
      card.remove();
      if (state.myList.size === 0) renderList();
    }
  } else {
    addToList(movie);
    persistList();
  }

  updateButtonState(btn, id);
});
