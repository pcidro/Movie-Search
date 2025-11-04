import { fetchMovies, fetchPopularMovies } from "./modules/api.js";
import { renderList } from "./modules/ui.js";
import { hydrateList } from "./modules/storage.js";
import { setCurrentView } from "./modules/state.js";
import { renderMovieDetails } from "./modules/moviedetails.js";

// =========================
// DOM ELEMENTS
// =========================
const inputMovie = document.getElementById("inputmovie");
const myListButton = document.querySelector("#my-list");
const searchIcon = document.getElementById("search-icon");
const h1text = document.getElementById("h1-text");

// =========================
// INITIALIZATION
// =========================
hydrateList();
fetchPopularMovies();

// =========================
// EVENTS
// =========================
searchIcon.addEventListener("click", () => {
  fetchMovies(inputMovie.value);
});

inputMovie.addEventListener("keyup", (e) => {
  if (e.key === "Enter") fetchMovies(inputMovie.value);
});

myListButton.addEventListener("click", (e) => {
  e.preventDefault();
  setCurrentView("list");
  h1text.innerText = "Your List";
  renderList();
});
