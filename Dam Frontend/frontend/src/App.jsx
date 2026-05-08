import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <h2 className="font-display font-bold text-5xl text-surface-700 mb-4">404</h2>
                <p className="text-surface-500 mb-6">This page doesn't exist in the vault.</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            } />
          </Routes>
        </main>
        <footer className="border-t border-surface-800/60 py-6 text-center">
          <p className="text-surface-600 text-xs font-mono">
            Vault DAM — Digital Asset Management
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;