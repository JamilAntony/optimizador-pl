// src/components/FlyButton.tsx
import { motion, useAnimation } from 'framer-motion';
import { FaRocket } from 'react-icons/fa';
import { useState } from 'react';

const FlyButton = () => {
  const controls = useAnimation();
  const [launched, setLaunched] = useState(false);

  const handleLaunch = async () => {
    if (launched) return;
    setLaunched(true);

    await controls.start({
      y: -200,
      opacity: 0,
      transition: { duration: 1, ease: 'easeInOut' },
    });

    // Redirige después del vuelo
    window.location.href = '/graficar';
  };

  return (
    <motion.button
      onClick={handleLaunch}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white
                 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                 shadow-lg hover:from-indigo-500 hover:to-pink-500 transition-all duration-300"
    >
      <motion.span animate={controls} className="text-xl">
        <FaRocket />
      </motion.span>
      <span>Toca Aquí para Iniciar</span>
    </motion.button>
  );
};

export default FlyButton;
