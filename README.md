Cuaca Harian
A modern weather application built with React, TypeScript, and Vite, featuring city search, 5-day forecast, favorites management, offline caching, and Progressive Web App (PWA) support.
Features

Search and view current weather (city, country, temperature, condition, humidity, wind speed, feels like).
Display 5-day forecast with daily min/max temperature and conditions.
Save/remove favorite cities using localStorage.
Offline access with cached weather data and warning for outdated data.
Responsive and accessible UI with Tailwind CSS, ARIA labels, and keyboard navigation.
PWA support with service worker for offline caching of API, images, and assets.
Error handling with loading spinners and user-friendly alerts.

Architecture Overview

Frontend: React with Functional Components and Hooks.
State Management: React Context for favorites.
Styling: Tailwind CSS (CDN + custom CSS).
Data Fetching: React Query for API caching, retry, and revalidation.
API: OpenWeatherMap for weather and forecast data.
PWA: Vite PWA plugin and Workbox for service worker.
Routing: React Router for navigation (Home, Search, Weather).
Build Tool: Vite for fast development and production builds.

Prerequisites
Before running the project, ensure you have:

Node.js (v18 or higher) and npm (v8 or higher) installed. Download from nodejs.org.
An OpenWeatherMap API key. Sign up at openweathermap.org to get one.
Git installed to clone the repository. Download from git-scm.com.
A code editor like VS Code.

Setup Instructions

Clone the Repository
git clone https://github.com/your-username/cuaca-harian.git
cd cuaca-harian


Install DependenciesInstall all required dependencies listed in package.json:
npm install

This will download:

Dependencies:
@tanstack/react-query: For data fetching and caching.
axios: For API requests.
react, react-dom, react-router-dom: Core React and routing.
sweetalert2: For error alerts.


Dev Dependencies:
@types/react, @types/react-dom: TypeScript types for React.
@vitejs/plugin-react: Vite React plugin.
typescript: For type safety.
vite: Build tool.
vite-plugin-pwa: For PWA support.
workbox-* (precaching, routing, strategies, cacheable-response, expiration): For service worker.




Prepare Icons

Download or create two PNG icons:
icon-192.png (192x192 pixels).
icon-512.png (512x512 pixels).


Place them in the public/ directory. You can generate icons using Favicon.io.
Example:mkdir public
mv path/to/icon-192.png public/icon-192.png
mv path/to/icon-512.png public/icon-512.png




Set Up Environment Variables

Create a .env file in the project root.
Add your OpenWeatherMap API key:VITE_API_KEY=your_openweathermap_api_key


Replace your_openweathermap_api_key with your actual API key.


Run the Application

Start the development server:npm run dev


Open http://localhost:5173 in your browser.
To test the production build:npm run build
npm run preview

Open http://localhost:4173.



Deployment

Deploy to Vercel or Netlify:
Push to a GitHub repository.
Connect to Vercel/Netlify and set the environment variable VITE_API_KEY.
Deploy using the command:npm run build




Deployed link: https://cuaca-harian.vercel.app (replace with your actual link).

Testing PWA

Open in Chrome, check DevTools > Application > Service Workers and Manifest.
Click the "+" icon in the address bar to install as a PWA.
Test offline mode by disabling internet and reloading the app.

Lighthouse Score

Run Lighthouse in Chrome DevTools (Performance, PWA categories).
Expected scores: Performance >90, PWA compliant (manifest and service worker detected).

Notes

Ensure icons and manifest.json are in public/ for PWA functionality.
If errors occur, clear cache:rm -rf node_modules package-lock.json
npm install


For API issues, verify your OpenWeatherMap API key is active.

