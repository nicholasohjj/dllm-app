import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface DarkModeContextType {
  isDarkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

interface DarkModeProviderProps {
  children: ReactNode;
}

const getStoredDarkMode = () => {
  if (typeof window === "undefined") return null;

  const savedDarkMode = localStorage.getItem("darkMode");
  if (savedDarkMode === null) return null;
  return savedDarkMode === "true";
};

const getSystemDarkMode = () =>
  typeof window !== "undefined" &&
  "matchMedia" in window &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
  const [hasUserPreference, setHasUserPreference] = useState(
    () => getStoredDarkMode() !== null
  );
  const [isDarkMode, setIsDarkModeState] = useState(
    () => getStoredDarkMode() ?? getSystemDarkMode()
  );

  useEffect(() => {
    if (hasUserPreference) return;
    if (!("matchMedia" in window)) return;

    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleDarkModeChange = (event: MediaQueryListEvent) => {
      setIsDarkModeState(event.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, [hasUserPreference]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);

    if (hasUserPreference) {
      localStorage.setItem("darkMode", isDarkMode.toString());
    }
  }, [hasUserPreference, isDarkMode]);

  const setDarkMode = useCallback((enabled: boolean) => {
    setHasUserPreference(true);
    setIsDarkModeState(enabled);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setHasUserPreference(true);
    setIsDarkModeState((prevMode) => !prevMode);
  }, []);

  return (
    <DarkModeContext.Provider
      value={{ isDarkMode, setDarkMode, toggleDarkMode }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);

  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }

  return context;
};
