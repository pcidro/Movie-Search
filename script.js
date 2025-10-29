const inputMovie = document.getElementById("inputmovie");
const moviesList = document.querySelector(".movies-list");
const myListButton = document.querySelector("#my-list");
const watchButtons = document.querySelectorAll(".btn-assistir");
const searchIcon = document.getElementById("search-icon");
const h1text = document.getElementById("h1-text");
const storage_key = "mylistv1";

const state = {
  searchResults: [],
  myList: new Map(),
};

let currentView = "search";

hydrateList();

searchIcon.addEventListener("click", fetchMovies);
inputMovie.addEventListener("keyup", (e) => {
  if (e.key === "Enter") fetchMovies();
});

myListButton.addEventListener("click", (e) => {
  e.preventDefault();
  currentView = "list";
  renderList();
});

function renderList() {
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
      h1text.innerText = "Popular Movies";
      fetchPopularMovies();
    });

    return;
  }
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    moviesList.appendChild(card);
  });
}

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
  }

  if (currentView === "list") {
    card.remove();

    if (state.myList.size === 0) {
      moviesList.innerHTML = "<p>Nenhum filme na sua lista ainda.</p>";
    }
  } else {
    addToList(movie);
  }
  updateButtonState(btn, id);
});

async function fetchMovies() {
  const query = inputMovie.value.trim().toLowerCase();
  if (!query) return;

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=748c8bacfdff03a69d854c2b198d6e30&query=${query}&language=en-US`
  );
  const data = await res.json();
  currentView = "search";
  state.searchResults = data.results;
  renderMovies(data.results);
}

async function fetchPopularMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=748c8bacfdff03a69d854c2b198d6e30&language=en-US&page=1`
  );
  const data = await res.json();
  currentView = "search";
  state.searchResults = data.results;
  renderMovies(data.results);
}

function createMovieCard(movie) {
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

  const safeRate = movie.vote_average
    ? Number(movie.vote_average).toFixed(1)
    : "N/A";

  rate.textContent = safeRate;

  const imgRate = document.createElement("img");
  imgRate.src = "/img/star.svg";
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

function updateButtonState(button, movieId) {
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

function renderMovies(movies) {
  moviesList.innerHTML = "";
  movies.forEach((movie) => {
    const card = createMovieCard(movie);
    moviesList.appendChild(card);
  });
}

function getMovieById(id) {
  const fromSearch = state.searchResults.find((movie) => movie.id === id);
  if (fromSearch) return fromSearch;

  return state.myList.get(id) || null;
}

function toMyListItem(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
  };
}

function isInList(id) {
  return state.myList.has(id);
}

function addToList(movie) {
  const item = toMyListItem(movie);
  state.myList.set(movie.id, item);
  persistList();
}

function removeFromList(id) {
  state.myList.delete(id);
  persistList();
}

function persistList() {
  const arr = [...state.myList.values()];
  localStorage.setItem(storage_key, JSON.stringify(arr));
}

function hydrateList() {
  try {
    const raw = localStorage.getItem(storage_key);
    if (!raw) return;
    const arr = JSON.parse(raw);
    state.myList = new Map(arr.map((item) => [item.id, item]));
  } catch (err) {
    console.error("fail to load localStorage", err);
    state.myList = new Map();
  }
}
fetchPopularMovies();
