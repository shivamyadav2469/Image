const UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = import.meta.env.VITE_API_KEY;

export const searchImages = async (query) => {
  try {
    const response = await fetch(`${UNSPLASH_API_URL}?query=${query}&client_id=${API_KEY}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};
