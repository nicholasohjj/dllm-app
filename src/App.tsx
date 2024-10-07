import { LaundryMonitorComponent } from "./components/laundry-monitor";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import { Toaster } from "@/components/ui/toaster";
import AboutUs from "./components/about-us";
function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Define route paths and corresponding components */}
        <Route path="/" element={<LaundryMonitorComponent />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </>
  );
}

export default App;
