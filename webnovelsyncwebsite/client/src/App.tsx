import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
