export const STORAGE_KEY = 'favourite_photo_ids';

// Loads saved favourites from localStorage when the app starts
export const initFavourites = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return [];
  }
};

export const favouritesReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_FAVOURITE': {
  const photoId = action.payload;
  return state.includes(photoId)
    ? state.filter((id) => id !== photoId)
    : [...state, photoId];
}
    default:
      return state;
  }
};