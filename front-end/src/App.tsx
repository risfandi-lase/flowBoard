// src/App.tsx
import { useState, useEffect } from "react";
import "./App.css";
import MainLayout from "./components/MainLayout";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import { ApiProvider, useApi } from "./contexts/ApiContext";

// Separate component to display loading state
const LoadingIndicator: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    <p className="mt-4 text-lg">Loading data, please wait...</p>
    <p className="text-sm text-gray-500">The backend may take a moment to start up.</p>
  </div>
);

// Main content component that uses the API context
const MainContent: React.FC = () => {
  const { loading } = useApi();

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
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
        <div className="flex-1 py-10 pr-24 overflow-auto">
          <MainLayout />
        </div>
      </div>
    </div>
  );
};

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
      <MainContent />
    </ApiProvider>
  );
}

export default App;
