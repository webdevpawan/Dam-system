import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Navbar - top navigation with logo and route links
 */
const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-800/80 backdrop-blur-xl bg-surface-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-900/40">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Vault
              <span className="text-brand-400">.</span>
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-display font-medium transition-all duration-150
                 ${isActive
                   ? 'bg-surface-800 text-surface-100'
                   : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60'
                 }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/upload"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-display font-medium transition-all duration-150
                 ${isActive
                   ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40'
                   : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60'
                 }`
              }
            >
              Upload
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;