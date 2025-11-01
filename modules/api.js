import { state, setCurrentView } from "./state.js";
import { renderMovies } from "./ui.js";

const API_KEY = "748c8bacfdff03a69d854c2b198d6e30";

export async function fetchMovies(query) {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return;

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${cleanQuery}&language=en-US`
  );
  const data = await res.json();

  setCurrentView("search");
  state.searchResults = data.results;
  renderMovies(data.results);
}

export async function fetchPopularMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );
  const data = await res.json();

  setCurrentView("search");
  state.searchResults = data.results;
  renderMovies(data.results);
}
