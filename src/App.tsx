import { LaundryMonitorComponent } from "@/components/laundry/LaundryMonitor";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AboutUs from "@/components/pages/AboutUs";
import NotFoundPage from "@/components/pages/NotFoundPage";
import { DarkModeProvider } from "@/contexts/DarkModeContext";

function App() {
  return (
    <>
      <DarkModeProvider>
        <Toaster />
        <Routes>
          {/* Define route paths and corresponding components */}
          <Route path="/" element={<LaundryMonitorComponent />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </DarkModeProvider>
    </>
  );
}

export default App;
