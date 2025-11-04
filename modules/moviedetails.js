import { fetchMovieById } from "./api.js";
import {
  isInList,
  addToList,
  removeFromList,
  setCurrentView,
} from "./state.js";
import { persistList } from "./storage.js";
import { fetchPopularMovies } from "./api.js";

const moviesList = document.querySelector(".movies-list");
const h1text = document.getElementById("h1-text");

export async function renderMovieDetails(id) {
  setCurrentView("details");
  h1text.innerHTML = "Detalhes do Filme";
  moviesList.innerHTML = "<p>Carregando...</p>";

  const movie = await fetchMovieById(id);
  moviesList.innerHTML = "";

  moviesList.classList.add("details-view");

  const container = document.createElement("div");
  container.classList.add("movie-details");

  const banner = document.createElement("div");
  banner.classList.add("movie-banner");
  banner.style.backgroundImage = movie.backdrop_path
    ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
    : `url(/img/NoImage.png)`;
  container.appendChild(banner);

  const info = document.createElement("div");
  info.classList.add("movie-info");

  const title = document.createElement("h2");
  title.textContent = movie.title;

  const year = document.createElement("p");
  year.textContent = `Lançamento: ${
    movie.release_date ? movie.release_date.slice(0, 4) : "N/A"
  }`;

  const rate = document.createElement("p");
  rate.textContent = `Nota: ${
    movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
  }`;

  const overview = document.createElement("p");
  overview.textContent = movie.overview || "Sem sinopse disponível.";

  const button = document.createElement("button");
  button.classList.add("btn-assistir");
  updateDetailsButton(button, movie.id);

  button.addEventListener("click", () => {
    if (isInList(movie.id)) {
      removeFromList(movie.id);
      persistList();
    } else {
      addToList(movie);
      persistList();
    }
    updateDetailsButton(button, movie.id);
  });

  const backBtn = document.createElement("button");
  backBtn.classList.add("searchmoviebtn");
  backBtn.textContent = "← Voltar";
  backBtn.addEventListener("click", () => {
    moviesList.classList.remove("details-view");
    fetchPopularMovies();
  });

  info.append(title, year, rate, overview, button, backBtn);
  container.appendChild(info);
  moviesList.appendChild(container);
}

function updateDetailsButton(button, movieId) {
  if (isInList(movieId)) {
    button.textContent = "Remover da Lista";
    button.classList.add("in-list");
  } else {
    button.textContent = "Adcionar a lista";
    button.classList.remove("in-list");
  }
}
