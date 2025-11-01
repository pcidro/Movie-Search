export const state = {
  searchResults: [],
  myList: new Map(),
};

export let currentView = "search";

export function setCurrentView(view) {
  currentView = view;
}

export function getMovieById(id) {
  const fromSearch = state.searchResults.find((movie) => movie.id === id);
  if (fromSearch) return fromSearch;
  return state.myList.get(id) || null;
}

export function toMyListItem(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
  };
}

export function isInList(id) {
  return state.myList.has(id);
}

export function addToList(movie) {
  const item = toMyListItem(movie);
  state.myList.set(movie.id, item);
}

export function removeFromList(id) {
  state.myList.delete(id);
}
