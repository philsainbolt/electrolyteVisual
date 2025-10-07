import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-relyte-blue text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">Re-Lyte</div>
            <div className="text-sm font-light hidden sm:block">
              | Electrolyte Comparison
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1 sm:space-x-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'bg-white text-relyte-blue font-semibold'
                  : 'hover:bg-relyte-accent'
              }`}
            >
              Chart
            </Link>
            <Link
              to="/table"
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive('/table')
                  ? 'bg-white text-relyte-blue font-semibold'
                  : 'hover:bg-relyte-accent'
              }`}
            >
              Data Table
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
