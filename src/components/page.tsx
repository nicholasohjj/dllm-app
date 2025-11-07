import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";

export default function CatchAllPage() {
  const { slug } = useParams<{ slug: string }>(); // Retrieve slug from params
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Retrieve dark mode preference from localStorage when the component is mounted
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === "true");
    } else {
      // Check system preference for dark mode if no preference is saved
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      setIsDarkMode(darkModeMediaQuery.matches);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`flex flex-col items-center justify-center min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4">
        404 - Page Not Found
      </motion.h1>
      <motion.p variants={itemVariants} className="text-xl mb-8">
        The page you're looking for doesn't exist.
      </motion.p>
      <AnimatePresence>
        {slug && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            You tried to access: /{slug}
          </motion.p>
        )}
      </AnimatePresence>
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/"
          className={`px-4 py-2 rounded-md ${
            isDarkMode
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition-colors duration-200`}
        >
          Go back to homepage
        </Link>
      </motion.div>
    </motion.div>
  );
}
