import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Weather from './pages/Weather';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <FavoritesProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <nav
            className="navbar p-4 sticky top-0 z-20"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <Link
                to="/"
                className="text-2xl font-bold text-[#106587]"
                aria-label="Cuaca Harian Home"
              >
                Cuaca Harian
              </Link>
              <button
                className="hamburger md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
                aria-expanded={isMenuOpen}
              >
                <span
                  className={`w-6 h-0.5 bg-[#106587] transition-transform duration-300 ${
    isMenuOpen ? 'rotate-45 translate-y-2' : ''
}`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-[#106587] transition-opacity duration-300 ${
    isMenuOpen ? 'opacity-0' : ''
}`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-[#106587] transition-transform duration-300 ${
    isMenuOpen ? '-rotate-45 -translate-y-2' : ''
}`}
                ></span>
              </button>
              <ul
                className={`nav-links md:flex md:space-x-6 md:items-center absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent transition-all duration-300 ease-in-out ${
    isMenuOpen ? 'flex flex-col p-4 shadow-lg' : 'hidden'
}`}
              >
                <li>
                  <Link
                    to="/"
                    className="text-[#106587] hover:text-[#0d4a6b] transition duration-300 block py-2 md:py-0"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Pergi ke Beranda"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search"
                    className="text-[#106587] hover:text-[#0d4a6b] transition duration-300 block py-2 md:py-0"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Pergi ke Pencarian Cuaca"
                  >
                    Cari Cuaca
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/weather/:city" element={<Weather />} />
            </Routes>
          </main>
          <footer className="footer" role="contentinfo">
            <p>© 2025 JoshuaHo. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </FavoritesProvider>
  );
};

export default App;