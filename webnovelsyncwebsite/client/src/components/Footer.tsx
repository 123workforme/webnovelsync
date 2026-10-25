import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-2">
              <img src="/webnovelsync-icon.png" alt="WebnovelSync" className="w-5 h-5" />
              <span className="font-semibold text-white">WebnovelSync</span>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
            <Link 
              to="/privacy" 
              className="hover:text-blue-400 transition-colors"
              onClick={() => window.scrollTo(0, 0)}
            >
              Privacy Policy
            </Link>
            <span>&copy; {new Date().getFullYear()} WebnovelSync. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
