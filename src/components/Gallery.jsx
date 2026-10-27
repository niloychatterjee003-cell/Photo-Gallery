import { useState, useReducer, useCallback, useMemo, useEffect } from 'react';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import { favouritesReducer, initFavourites, STORAGE_KEY } from '../reducers/favouritesReducer';

export default function Gallery() {
  // Fetch photos using our custom hook
  const { photos, loading, error } = useFetchPhotos();

  // Manage favourites with useReducer and localStorage
  const [favourites, dispatch] = useReducer(favouritesReducer, [], initFavourites);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    }, [favourites]);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized search input handler
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Memoized filtered photos list
  const filteredPhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return photos;

    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    );
  }, [photos, searchQuery]);

  // Toggle favourite handler
  const handleToggleFavourite = (id) => {
    dispatch({ type: 'TOGGLE_FAVOURITE', payload: id });
  };

  // Loading spinner state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading photos...</p>
      </div>
    );
  }

  // Error message state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <p className="font-semibold text-lg">Error Loading Gallery</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search photos by author name..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
        />
      </div>

      {/* Responsive Grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
      {filteredPhotos.length === 0 ? (
        <p className="text-center text-gray-500 my-12">
          No photos found matching "{searchQuery}".
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => {
            const isFav = favourites.includes(photo.id);

            return (
              <div
                key={photo.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                  <img
                    src={photo.download_url}
                    alt={photo.author}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex items-center justify-between">
                  <span className="font-medium text-gray-800 truncate pr-2">
                    {photo.author}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleFavourite(photo.id)}
                    aria-label="Toggle Favourite"
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className={`w-6 h-6 transition-colors ${
                        isFav
                          ? 'fill-red-500 text-red-500'
                          : 'fill-none text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}