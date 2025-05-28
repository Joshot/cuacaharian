import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_KEY = import.meta.env.VITE_API_KEY || '9a94d11d3f14404a5faf40c5c994c15a';

const showLoading = () => {
  const overlay = document.getElementById('loading-overlay')!;
  overlay.style.display = 'flex';
};

const hideLoading = () => {
  const overlay = document.getElementById('loading-overlay')!;
  overlay.style.display = 'none';
};

const Search: React.FC = () => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    showLoading();
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
const cities = response.data.map((item: { name: string }) => item.name);
setSuggestions(cities);
} catch {
    setSuggestions([]);
    Swal.fire({
        title: 'Error!',
        text: 'Gagal mengambil saran kota',
        icon: 'error',
        confirmButtonColor: '#106587',
    });
} finally {
    hideLoading();
}
};

const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
        Swal.fire({
            title: 'Peringatan!',
            text: 'Masukkan nama kota terlebih dahulu',
            icon: 'warning',
            confirmButtonColor: '#106587',
        });
        return;
    }
    navigate(`/weather/${encodeURIComponent(city.trim())}`);
};

const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion);
    setSuggestions([]);
    navigate(`/weather/${encodeURIComponent(suggestion)}`);
};

return (
    <div className="max-w-7xl mx-auto p-6 animate-[fade-in_0.5s_ease-out]" role="main">
        <h1 className="text-3xl font-bold text-[#106587] mb-6 text-center">Cari Cuaca</h1>
        <div className="material-card p-8 max-w-lg mx-auto">
            <form onSubmit={handleSearch} className="space-y-4 relative" role="search">
                <label htmlFor="city-search" className="sr-only">
                    Cari kota
                </label>
                <input
                    id="city-search"
                    type="text"
                    value={city}
                    onChange={(e) => {
                        setCity(e.target.value);
                        fetchSuggestions(e.target.value);
                    }}
                    placeholder="Cari kota (misal: Jakarta...)"
                    className="input-field"
                    aria-label="Masukkan nama kota untuk mencari cuaca"
                />
                {suggestions.length > 0 && (
                    <ul className="suggestion-list" role="listbox" aria-label="Saran kota">
                        {suggestions.map((suggestion) => (
                            <li
                                key={suggestion}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="suggestion-item"
                                role="option"
                                aria-selected={false}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
                <button type="submit" className="btn btn-primary w-full" aria-label="Cari cuaca">
                    Cari
                </button>
                <button
                    type="button"
                    onClick={() => {
                        showLoading();
                        navigator.geolocation.getCurrentPosition(
                            async (position) => {
                                const { latitude, longitude } = position.coords;
                                try {
                                    const response = await axios.get(
                                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                                    );
                                    navigate(`/weather/${encodeURIComponent(response.data.name)}`);
                                } catch {
                                    Swal.fire({
                                        title: 'Error!',
                                        text: 'Gagal mengambil data cuaca untuk lokasi Anda',
                                        icon: 'error',
                                        confirmButtonColor: '#106587',
                                    });
                                } finally {
                                    hideLoading();
                                }
                            },
                            () => {
                                hideLoading();
                                Swal.fire({
                                    title: 'Peringatan!',
                                    text: 'Gagal mendapatkan lokasi. Izinkan akses lokasi di browser Anda.',
                                    icon: 'warning',
                                    confirmButtonColor: '#106587',
                                });
                            }
                        );
                    }}
                    className="btn btn-secondary w-full"
                    aria-label="Gunakan lokasi saat ini"
                >
                    Gunakan Lokasi Saya
                </button>
            </form>
        </div>
    </div>
);
};

export default Search;