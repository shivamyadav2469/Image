import React, { useRef, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE = 20;

const SearchPage = ({ onImageSelect }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);

  const fetchImages = async (query) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}?query=${query}&page=1&per_page=${IMAGES_PER_PAGE}&client_id=${import.meta.env.VITE_API_KEY}`
      );
      setImages(data.results || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchInput.current.value) {
      fetchImages(searchInput.current.value);
    }
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    fetchImages(selection);
  };

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Image Search</h1>

      <form onSubmit={handleSearch} className="flex justify-center items-center gap-4 mb-6">
        <input
          type="search"
          placeholder="Search for images..."
          className="border rounded-lg p-3 w-2/3 md:w-1/2 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          ref={searchInput}
        />
        <button type="submit" className="px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200">
          Search
        </button>
      </form>

      <div className="flex justify-center gap-4 mb-6">
        {['Nature', 'Birds', 'Cats', 'Shoes'].map((label) => (
          <button
            key={label}
            onClick={() => handleSelection(label.toLowerCase())}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center my-10">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
          {images.length > 0 ? (
            images.map((image) => (
              <div key={image.id} className="relative group overflow-hidden rounded-lg shadow-lg">
                <img src={image.urls.small} alt={image.alt_description} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <button
                  className="absolute inset-x-0 bottom-0 bg-indigo-600 bg-opacity-75 text-white px-4 py-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => onImageSelect(image.urls.regular)}
                >
                  Add Caption
                </button>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-500">No images found. Try a different search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
