import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

interface ForecastData {
  list: { dt: number; main: { temp_min: number; temp_max: number }; weather: { description: string; icon: string }[] }[];
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

const fetchForecast = async (city: string): Promise<ForecastData> => {
    showLoading();
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        return response.data;
    } catch (error) {
        throw new Error('Gagal mengambil data prakiraan');
    } finally {
        hideLoading();
    }
};

const Weather: React.FC = () => {
    const { city } = useParams<{ city: string }>();
    const decodedCity = city ? decodeURIComponent(city) : '';
    const { addFavorite, removeFavorite, favorites } = useFavorites();
    const isFavorite = decodedCity ? favorites.some((fav) => fav.city.toLowerCase() === decodedCity.toLowerCase()) : false;

    const { data: weather, error: weatherError, isLoading: weatherLoading } = useQuery({
        queryKey: ['weather', decodedCity],
        queryFn: () => decodedCity ? fetchWeather(decodedCity) : Promise.reject(new Error('City not provided')),
        staleTime: 1000 * 60 * 5,
        retry: 2,
        enabled: !!decodedCity,
    });

    const { data: forecast, error: forecastError } = useQuery({
        queryKey: ['forecast', decodedCity],
        queryFn: () => decodedCity ? fetchForecast(decodedCity) : Promise.reject(new Error('City not provided')),
        staleTime: 1000 * 60 * 5,
        retry: 2,
        enabled: !!decodedCity,
    });

    useEffect(() => {
        if (weather && decodedCity) {
            localStorage.setItem(`weather_${decodedCity.toLowerCase()}`, JSON.stringify(weather));
            const recentSearches: RecentSearch[] = JSON.parse(localStorage.getItem('recentSearches') || '[]');
            if (!recentSearches.some((s) => s.city.toLowerCase() === decodedCity.toLowerCase())) {
                recentSearches.unshift({ city: decodedCity });
                if (recentSearches.length > 5) recentSearches.pop();
                localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
            }
        }
    }, [weather, decodedCity]);

    useEffect(() => {
        if (weatherError || forecastError) {
            Swal.fire({
                title: 'Error!',
                text: weatherError?.message.includes('404') || forecastError?.message.includes('404')
                    ? 'Kota tidak ditemukan'
                    : 'Gagal mengambil data cuaca atau prakiraan',
                icon: 'error',
                confirmButtonColor: '#106587',
            });
        }
    }, [weatherError, forecastError]);

    const offlineWeather = decodedCity ? localStorage.getItem(`weather_${decodedCity.toLowerCase()}`) : null;
    const displayWeather = weather || (offlineWeather ? JSON.parse(offlineWeather) : null);
    const dailyForecast = forecast?.list.filter((item, index) => index % 8 === 0).slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto p-6 animate-[fade-in_0.5s_ease-out]" role="main">
            <h1 className="text-3xl font-bold text-[#106587] mb-6 text-center">Detail Cuaca</h1>
            {weatherLoading && (
                <div className="flex justify-center">
                    <div className="loading-spinner"></div>
                </div>
            )}
            {!decodedCity && (
                <p className="text-red-500 text-center">Kota tidak ditentukan</p>
            )}
            {displayWeather && (
                <div className="material-card p-8 max-w-4xl mx-auto" role="article" aria-label={`Weather details for ${displayWeather.name}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#106587]">{displayWeather.name}, {displayWeather.sys.country}</h2>
                        <button
                            onClick={() =>
                                isFavorite
                                    ? removeFavorite(displayWeather.name)
                                    : addFavorite(displayWeather.name, displayWeather.sys.country)
                            }
                            className="text-[#106587] hover:text-[#0d4a6b] transition-transform transform hover:scale-110"
                            aria-label={isFavorite ? `Remove ${displayWeather.name} from favorites` : `Add ${displayWeather.name} to favorites`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={isFavorite ? '#106587' : 'none'}
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-8"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-center">
                            <img
                                src={`http://openweathermap.org/img/wn/${displayWeather.weather[0].icon}@4x.png`}
                                alt={`Weather condition: ${displayWeather.weather[0].description}`}
                                className="weather-icon mx-auto animate-[pulse_2s_ease-in-out_infinite]"
                            />
                            <p className="text-5xl font-bold text-[#106587]">{displayWeather.main.temp}°C</p>
                            <p className="text-xl capitalize text-gray-700">{displayWeather.weather[0].description}</p>
                        </div>
                        <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                            <p className="text-gray-700 text-lg"><strong>Terasa Seperti:</strong> {displayWeather.main.feels_like}°C</p>
                            <p className="text-gray-700 text-lg"><strong>Kelembapan:</strong> {displayWeather.main.humidity}%</p>
                            <p className="text-gray-700 text-lg"><strong>Kecepatan Angin:</strong> {displayWeather.wind.speed} m/s</p>
                        </div>
                    </div>
                    {!weather && offlineWeather && (
                        <p className="text-yellow-500 text-sm mt-4 text-center">Data offline, mungkin tidak terbaru</p>
                    )}
                    {dailyForecast && (
                        <div className="mt-10">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Perkiraan 5 Hari</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {dailyForecast.map((day, index) => (
                                    <div
                                        key={index}
                                        className="material-card p-4 text-center"
                                        role="article"
                                        aria-label={`Forecast for ${new Date(day.dt * 1000).toLocaleDateString('id-ID', { weekday: 'long' })}`}
                                    >
                                        <p className="text-sm font-medium text-gray-700">
                                            {new Date(day.dt * 1000).toLocaleDateString('id-ID', { weekday: 'long' })}
                                        </p>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                                            alt={`Forecast condition: ${day.weather[0].description}`}
                                            className="weather-icon mx-auto"
                                        />
                                        <p className="text-sm text-gray-700">Maks: {day.main.temp_max}°C</p>
                                        <p className="text-sm text-gray-700">Min: {day.main.temp_min}°C</p>
                                        <p className="text-sm capitalize text-gray-700">{day.weather[0].description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Weather;
