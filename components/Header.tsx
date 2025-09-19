
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

const Header: React.FC = () => {
  const { setLanguage, language } = useLanguage();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'text-amber-400' : 'text-stone-300 hover:text-amber-300'
    }`;

  return (
    <header className="bg-stone-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-md shadow-stone-950/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-serif font-bold text-amber-300">
              BM Beauty
            </NavLink>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/try" className={navLinkClasses}>
                  Live Try-On
                </NavLink>
                <NavLink to="/studio" className={navLinkClasses}>
                  Studio
                </NavLink>
                 <NavLink to="/aftercare" className={navLinkClasses}>
                  Aftercare
                </NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center">
             <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'pl' | 'ru' | 'ua')}
                className="bg-stone-800 border border-stone-700 text-stone-200 text-xs rounded-md focus:ring-amber-500 focus:border-amber-500 block w-full p-1.5"
              >
                <option value="pl">PL 🇵🇱</option>
                <option value="ru">RU 🇷🇺</option>
                <option value="ua">UA 🇺🇦</option>
              </select>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
