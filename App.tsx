
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './hooks/useLanguage';
import LandingPage from './components/LandingPage';
import TryOnPage from './components/TryOnPage';
import ResultPage from './components/ResultPage';
import StudioPage from './components/StudioPage';
import AftercarePage from './components/AftercarePage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-stone-900 text-stone-200">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/try" element={<TryOnPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/studio" element={<StudioPage />} />
              <Route path="/aftercare" element={<AftercarePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </LanguageProvider>
  );
}

export default App;
