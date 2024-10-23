import { LaundryMonitorComponent } from "./components/laundry-monitor";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import { Toaster } from "@/components/ui/toaster";
import AboutUs from "./components/about-us";
import CatchAllPage from "./components/page";
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { DarkModeProvider } from "./DarkModeContext";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function App() {
  return (
    <>
    <DarkModeProvider>
      <Toaster />
      <Routes>
        {/* Define route paths and corresponding components */}
        <Route path="/" element={<LaundryMonitorComponent />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="*" element={<CatchAllPage/>} />
      </Routes>
    </DarkModeProvider>
    </>
  );
}

export default App;
