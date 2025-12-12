import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import DataTable from "./components/DataTable";
import DataGrid from "./components/DataGrid";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function App() {
  const getInitialView = (): 'table' | 'grid' => {
    const hash = window.location.hash.slice(1);
    return hash === 'grid' ? 'grid' : 'table';
  };

  const [activeView, setActiveView] = useState<'table' | 'grid'>(getInitialView);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setActiveView(hash === 'grid' ? 'grid' : 'table');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleViewChange = (view: 'table' | 'grid') => {
    setActiveView(view);
    window.location.hash = view;
  };

  return (
    <ErrorBoundary>
      <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Mobile Navigation */}
        <MobileNav activeView={activeView} onViewChange={handleViewChange} />

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <Sidebar activeView={activeView} onViewChange={handleViewChange} />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-gray-950">
            {activeView === 'table' ? <DataTable /> : <DataGrid />}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
