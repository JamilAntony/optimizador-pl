// src/Layout.tsx estilizado
import React from 'react';
import { motion } from 'framer-motion';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-black text-gray-900 dark:text-white font-sans">
      <header className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">Optimizador PL</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="bg-white/80 dark:bg-gray-800 backdrop-blur-sm mt-12 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
        © 2025 OptimizadorPL — Desarrollado con 💙 por Parziball
      </footer>
    </div>
  );
};

export default Layout;
