import { useState, useEffect } from "react";
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

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">The page you're looking for doesn't exist.</p>
      {slug && (
        <p className="mb-4">
          You tried to access: /{slug}
          </p>
      )}
      <Link to="/" className="text-blue-500 hover:underline">
        Go back to homepage
      </Link>
    </div>
  );
}
