import { createContext, useContext, useEffect, useState } from "react";

// Create a context for Dark Mode
const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Retrieve the saved dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem("darkMode");
    
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === "true");
    } else {
      // If no preference is saved, use system preference
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      setIsDarkMode(darkModeMediaQuery.matches);

      // Listen for system preference changes
      const handleDarkModeChange = (event) => setIsDarkMode(event.matches);
      darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

      return () => {
        darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
      };
    }
  }, []);

  useEffect(() => {
    // Save the user's dark mode preference in localStorage
    localStorage.setItem("darkMode", isDarkMode.toString());
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use dark mode state
export const useDarkMode = () => useContext(DarkModeContext);
