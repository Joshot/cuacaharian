import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useFavorites } from '../context/FavoritesContext';

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number; feels_like: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface RecentSearch {
  city: string;
}

const API_KEY = import.meta.env.VITE_API_KEY || '9a94d11d3f14404a5faf40c5c994c15a';

const showLoading = () => {
  const overlay = document.getElementById('loading-overlay')!;
  overlay.style.display = 'flex';
};

const hideLoading = () => {
  const overlay = document.getElementById('loading-overlay')!;
  overlay.style.display = 'none';
};

const fetchWeather = async (city: string): Promise<WeatherData> => {
  showLoading();
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
return response.data;
} catch (error) {
    throw new Error('Gagal mengambil data cuaca');
} finally {
    hideLoading();
}
};

const WeatherCard: React.FC<{ city: string; isFavorite?: boolean }> = ({ city, isFavorite }) => {
    const { addFavorite, removeFavorite, favorites } = useFavorites();
    const isFav = isFavorite ?? favorites.some((fav) => fav.city.toLowerCase() === city.toLowerCase());

    const { data: weather, error, isLoading } = useQuery({
        queryKey: ['weather', city],
        queryFn: () => fetchWeather(city),
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });

    useEffect(() => {
        if (weather) {
            localStorage.setItem(`weather_${city.toLowerCase()}`, JSON.stringify(weather));
        }
    }, [weather, city]);

    useEffect(() => {
        if (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message.includes('404') ? 'Kota tidak ditemukan' : 'Gagal mengambil data cuaca',
                icon: 'error',
                confirmButtonColor: '#106587',
            });
        }
    }, [error]);

    const offlineWeather = localStorage.getItem(`weather_${city.toLowerCase()}`);
    const displayWeather = weather || (offlineWeather ? JSON.parse(offlineWeather) : null);

    return (
        <Link
            to={`/weather/${encodeURIComponent(displayWeather?.name || city)}`}
            className="material-card p-6 block cursor-pointer"
            role="article"
            aria-label={`Lihat detail cuaca untuk ${displayWeather?.name || city}`}
        >
            {isLoading && (
                <div className="flex justify-center">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {displayWeather && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-[#106587]">
                            {displayWeather.name}, {displayWeather.sys.country}
                        </h3>
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // Prevent navigation when clicking favorite
                                isFav
                                    ? removeFavorite(displayWeather.name)
                                    : addFavorite(displayWeather.name, displayWeather.sys.country);
                            }}
                            className="text-[#106587] hover:text-[#0d4a6b] transition-transform transform hover:scale-110"
                            aria-label={
                                isFav
                                    ? `Hapus ${displayWeather.name} dari favorit`
                                    : `Tambah ${displayWeather.name} ke favorit`
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={isFav ? '#106587' : 'none'}
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <img
                            src={`http://openweathermap.org/img/wn/${displayWeather.weather[0].icon}@2x.png`}
                            alt={`Kondisi cuaca: ${displayWeather.weather[0].description}`}
                            className="weather-icon"
                        />
                        <div>
                            <p className="text-lg font-semibold">Suhu: {displayWeather.main.temp}°C</p>
                            <p className="capitalize">Kondisi: {displayWeather.weather[0].description}</p>
                        </div>
                    </div>
                    {!weather && offlineWeather && (
                        <p className="text-yellow-500 text-sm mt-2">Data offline, mungkin tidak terbaru</p>
                    )}
                </div>
            )}
        </Link>
    );
};

const Home: React.FC = () => {
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
        const saved = localStorage.getItem('recentSearches');
        return saved ? JSON.parse(saved) : [];
    });
    const { favorites } = useFavorites();

    return (
        <div
            className="max-w-7xl mx-auto p-6 animate-[fade-in_0.5s_ease-out]"
            role="main"
            aria-label="Halaman Beranda Cuaca Harian"
        >
            <h1 className="text-3xl font-bold text-[#106587] mb-6 text-center">Cuaca Harian</h1>
            <section aria-labelledby="favorites-heading">
                <h2 id="favorites-heading" className="text-2xl font-semibold text-gray-800 mb-4">
                    Kota Favorit
                </h2>
                {favorites.length === 0 ? (
                    <p className="text-gray-500 text-center">
                        Tidak ada kota favorit. Tambahkan dari halaman cuaca!
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((fav) => (
                            <WeatherCard key={fav.city} city={fav.city} isFavorite={true} />
                        ))}
                    </div>
                )}
            </section>
            <section aria-labelledby="recent-heading" className="mt-8">
                <h2 id="recent-heading" className="text-2xl font-semibold text-gray-800 mb-4">
                    Pencarian Terbaru
                </h2>
                {recentSearches.length === 0 ? (
                    <p className="text-gray-500 text-center">
                        Tidak ada riwayat pencarian. Cari kota sekarang!
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentSearches.map((search) => (
                            <WeatherCard key={search.city} city={search.city} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
