import React, { createContext, useContext, useState, useEffect } from 'react';

interface Favorite {
  city: string;
  country: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (city: string, country: string) => void;
  removeFavorite: (city: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (city: string, country: string) => {
    setFavorites((prev) => {
      if (!prev.some((fav) => fav.city.toLowerCase() === city.toLowerCase())) {
        return [...prev, { city, country }];
      }
      return prev;
    });
  };

  const removeFavorite = (city: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.city.toLowerCase() !== city.toLowerCase()));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};