import { state } from "./state.js";

export const storage_key = "mylistv1";

export function persistList() {
  const arr = [...state.myList.values()];
  localStorage.setItem(storage_key, JSON.stringify(arr));
}

export function hydrateList() {
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
