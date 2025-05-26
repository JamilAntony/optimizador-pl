import { motion } from 'framer-motion';
import { FaProjectDiagram, FaBook } from 'react-icons/fa';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useCallback, useState } from 'react';
import FlyButton from '../components/FlyButton';

const HomePage = () => {
  const [showManual, setShowManual] = useState(false);

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="bg-transparent">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: 'transparent' },
          fpsLimit: 60,
          particles: {
            number: { value: 50 },
            size: { value: 3 },
            color: { value: "#6366f1" },
            links: {
              enable: true,
              color: "#a5b4fc",
              distance: 150,
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              outModes: { default: "bounce" },
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" },
            },
            modes: {
              repulse: { distance: 100 },
              push: { quantity: 4 },
            },
          },
        }}
        className="absolute top-0 left-0 w-full h-full z-0"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center space-y-4 mb-10"
      >
        <FaProjectDiagram className="text-indigo-600 dark:text-indigo-300 text-6xl mb-4 animate-pulse h-100" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white drop-shadow">
          Programación Lineal <br /> Interactiva
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
          Descubre el poder de optimizar soluciones mediante programación lineal.
        </p>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-50 mt-8"
      >
      <FlyButton />

        <button
          onClick={() => setShowManual(true)}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-white text-indigo-700 border-2 border-indigo-300 font-semibold shadow-md hover:bg-indigo-100 hover:scale-105 transition"
        >
          <FaBook className="text-lg" /> Manual del Usuario
        </button>
      </motion.div>


      {/* Modal flotante del Manual del Usuario */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-">
          <div className="relative w-full max-w-6xl max-h-[96vh] h-full">

            {/* Botón cerrar */}
            <button
              onClick={() => setShowManual(false)}
              className="absolute top-3 right-3 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 shadow transition"
              title="Cerrar"
            >
              ✕
            </button>

            {/* Contenido del iframe */}
            <div className="flex-1 overflow-y-auto mt-12 h-100">
              <iframe
                src="https://docs.google.com/document/d/1JvsdGJvJaUYesjXo87rTxNHnWyHJzfTTZ16iGqzzKGk/preview"
                width="100%"
                height="100%"
                className="w-full h-full border-none"
              ></iframe>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default HomePage;
