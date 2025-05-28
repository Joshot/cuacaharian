import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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

const API_KEY = import.meta.env.VITE_API_KEY || '9a94d11d3f14404a5faf40c5c994c15a';

const fetchWeather = async (city: string): Promise<WeatherData> => {
    const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    return response.data;
};

const fetchForecast = async (city: string): Promise<ForecastData> => {
    const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    return response.data;
};

const WeatherCard: React.FC<{ city: string }> = ({ city }) => {
    const { addFavorite, removeFavorite, favorites } = useFavorites();
    const isFavorite = favorites.some((fav) => fav.city.toLowerCase() === city.toLowerCase());

    const { data: weather, error, isLoading } = useQuery({
        queryKey: ['weather', city],
        queryFn: () => fetchWeather(city),
        staleTime: 1000 * 60 * 5,
    });

    const { data: forecast } = useQuery({
        queryKey: ['forecast', city],
        queryFn: () => fetchForecast(city),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (weather) {
            localStorage.setItem(`weather_${city.toLowerCase()}`, JSON.stringify(weather));
        }
    }, [weather, city]);

    const offlineWeather = localStorage.getItem(`weather_${city.toLowerCase()}`);
    const displayWeather = weather || (offlineWeather ? JSON.parse(offlineWeather) : null);
    const dailyForecast = forecast?.list.filter((item, index) => index % 8 === 0).slice(0, 5);

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full mb-4">
            {isLoading && <p className="text-center">Memuat...</p>}
            {error && (
                <p className="text-red-500 text-center">
                    {error.message.includes('404') ? 'Kota tidak ditemukan' : 'Terjadi kesalahan'}
                </p>
            )}
            {displayWeather && (
                <div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{displayWeather.name}, {displayWeather.sys.country}</h2>
                        <button
                            onClick={() =>
                                isFavorite
                                    ? removeFavorite(displayWeather.name)
                                    : addFavorite(displayWeather.name, displayWeather.sys.country)
                            }
                            className="text-xl"
                        >
                            {isFavorite ? '♥' : '♡'}
                        </button>
                    </div>
                    <p>Suhu: {displayWeather.main.temp}°C</p>
                    <p className="capitalize">Kondisi: {displayWeather.weather[0].description}</p>
                    <img
                        src={`http://openweathermap.org/img/wn/${displayWeather.weather[0].icon}.png`}
                        alt="Weather icon"
                        className="mx-auto"
                    />
                    <p>Kelembapan: {displayWeather.main.humidity}%</p>
                    <p>Angin: {displayWeather.wind.speed} m/s</p>
                    <p>Terasa seperti: {displayWeather.main.feels_like}°C</p>
                    {!weather && offlineWeather && <p className="text-yellow-500 text-sm">Data offline</p>}
                </div>
            )}
            {dailyForecast && (
                <div className="mt-2">
                    <h3 className="font-semibold">Perkiraan Cuaca 5 Hari Kedepan</h3>
                    <div className="grid grid-cols-5 gap-1">
                        {dailyForecast.map((day, index) => (
                            <div key={index} className="text-center">
                                <p className="text-xs">
                                    {new Date(day.dt * 1000).toLocaleDateString('id-ID', { weekday: 'short' })}
                                </p>
                                <img
                                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                                    alt="Forecast icon"
                                />
                                <p className="text-xs">{day.main.temp_max}°/{day.main.temp_min}°</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Favorites: React.FC = () => {
    const { favorites } = useFavorites();
    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">Kota Favorit</h1>
            {favorites.length === 0 ? (
                <p>Tidak ada kota favorit.</p>
            ) : (
                <div className="w-full max-w-md">
                    {favorites.map((fav) => (
                        <WeatherCard key={fav.city} city={fav.city} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;