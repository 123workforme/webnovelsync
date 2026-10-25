import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8 max-w-md">
        <div className="mb-8">
          <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-4xl font-bold">!</span>
          </div>
          <h1 className="text-6xl font-bold mb-4 text-white">404</h1>
          <h2 className="text-2xl font-semibold mb-6 text-gray-300">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved. But don't worry, you can still get WebnovelSync!
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="w-full text-lg py-6 bg-blue-500 hover:bg-blue-600">
              Go Home
            </Button>
          </Link>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full text-lg py-6 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            onClick={() => window.open('https://chrome.google.com/webstore/detail/webnovelsync/your-extension-id', '_blank')}
          >
            Get Extension
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
