import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setOpen] = useState(false);

  const navigationItems: { title: string; href: string }[] = [];

  return (
    <header className="w-full z-40 sticky top-0 left-0 bg-gray-900 shadow-md">
      <div className="container relative mx-auto min-h-16 flex items-center justify-between px-4">
        <div className="w-24 lg:w-32 invisible">
          <button
            onClick={() => setOpen(!isOpen)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-blue-50 text-blue-700"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
            )}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
        
        <div className="flex items-center justify-center">
          <Link to="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-blue-600">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span className="font-bold text-xl text-white">WebnovelSync</span>
          </Link>
        </div>

        <div className="w-24 lg:w-32 invisible">
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-gray-700 bg-gray-800">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-700 hover:text-blue-300 text-white text-center"
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
