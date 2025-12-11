import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import DataTable from "./components/DataTable";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <div className="w-screen h-screen bg-gray-950 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-gray-950">
            <DataTable />
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
