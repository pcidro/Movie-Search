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

function renderMovies(movies) {
  moviesList.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("li");
    movieCard.classList.add("movie");
    const movieName = document.createElement("h1");
    movieName.textContent = movie.title;
    const movieImg = document.createElement("img");
    movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    movieCard.appendChild(movieName);
    movieCard.appendChild(movieImg);
    moviesList.appendChild(movieCard);
  });
}
