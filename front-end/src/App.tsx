import "./App.css";
import MainLayout from "./components/MainLayout";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div
      data-theme="cmyk"
      className="bg-base-100 h-screen flex flex-col overflow-hidden"
    >
      <div className="flex-shrink-0">
        <NavBar />
      </div>

      <div className="flex flex-1 overflow-hidden gap-8">
        <div className="py-10 pl-10 flex-shrink-0">
          <Sidebar />
        </div>
        <div className=" flex-1 py-10 pr-10 overflow-auto">
          <MainLayout />
        </div>
      </div>
    </div>
  );
}

export default App;
