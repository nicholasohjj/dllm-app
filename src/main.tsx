// Import the necessary modules and components
import { StrictMode } from "react"; // StrictMode is a tool for highlighting potential problems in the application
import { createRoot } from "react-dom/client"; // New API from React 18 to create a root for rendering components
import App from "./App.tsx"; // Import the main application component
import "./index.css"; // Import global CSS styles for the application
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter to enable routing within the app
import { Analytics } from "@vercel/analytics/react";
// Create the root for rendering the app and target the 'root' div in the HTML
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {" "}
    {/* Wrap the application in StrictMode to activate additional checks and warnings in development */}
    <BrowserRouter>
      {" "}
      {/* Enable React Router for handling navigation in the app */}
      <Analytics />
      <App />{" "}
      {/* Render the main App component which will contain all other components */}
    </BrowserRouter>
  </StrictMode>
);
