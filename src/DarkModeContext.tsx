import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define the shape of the Dark Mode context
interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Provide a default value for the context
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

interface DarkModeProviderProps {
  children: ReactNode; // Define the type for children
}

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
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
      const handleDarkModeChange = (event: MediaQueryListEvent) => setIsDarkMode(event.matches);
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
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }

  return context;
};
