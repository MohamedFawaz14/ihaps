import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";


// Frontend Pages
import Navbar from "./components/client/Navbar.jsx";
import Footer from "./components/client/Footer.jsx";
import { Toaster } from "sonner";
import RouterController from "./router/RouterController.jsx";
// ===== ScrollToTop Component (keeps your original logic) =====
function ScrollToTop() {
const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


// ===== Main App =====
export default function App() {
  return (
    <div className="App">
      <Navbar/>
      <ScrollToTop />
      <Toaster />
      <RouterController />
      <Footer/>
    </div>
  );
}
