// src/App.tsx
import { useState, useEffect } from "react";
import "./App.css";
import MainLayout from "./components/MainLayout";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { ApiProvider } from "./contexts/ApiContext";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <p className="text-2xl">
          Please switch to the desktop version - the mobile version is still in
          development :)
        </p>
      </div>
    );
  }

  return (
    <ApiProvider>
      <div
        data-theme="cmyk"
        className="bg-base-300 h-screen flex flex-col overflow-hidden"
      >
        <div className="flex-shrink-0">
          <NavBar />
        </div>

        <div className="flex flex-1 overflow-hidden gap-8">
          <div className="py-10 pl-24 flex-shrink-0">
            <Sidebar />
          </div>
          <div className=" flex-1 py-10 pr-24 overflow-auto">
            <MainLayout />
          </div>
        </div>
      </div>
    </ApiProvider>
  );
}

export default App;
