import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LinearProgrammingPage from './pages/LinearProgrammingPage';
import HomePage from './pages/HomePage';
import './App.css'; // Aquí puedes definir .animated-gradient

const App: React.FC = () => {
  return (
    <Router>
      {/* Fondo animado aplicado a toda la app */}
      <div className="min-h-screen w-full animated-gradient text-white">
        <nav className="bg-white/20 backdrop-blur-md dark:bg-gray-800/20 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/graficar" element={<LinearProgrammingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
