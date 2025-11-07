import { LaundryMonitorComponent } from "./components/laundry-monitor";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import { Toaster } from "@/components/ui/toaster";
import AboutUs from "./components/about-us";
import CatchAllPage from "./components/page";
import { DarkModeProvider } from "./DarkModeContext";

function App() {
  return (
    <>
      <DarkModeProvider>
        <Toaster />
        <Routes>
          {/* Define route paths and corresponding components */}
          <Route path="/" element={<LaundryMonitorComponent />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="*" element={<CatchAllPage />} />
        </Routes>
      </DarkModeProvider>
    </>
  );
}

export default App;
