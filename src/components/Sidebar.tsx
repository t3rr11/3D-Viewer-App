import TableIcon from "./icons/TableIcon";
import GridIcon from "./icons/GridIcon";

interface SidebarProps {
  activeView: "table" | "grid";
  onViewChange: (view: "table" | "grid") => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4">
      <nav className="space-y-2">
        <button
          onClick={() => onViewChange("table")}
          className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === "table"
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <TableIcon />
            Table View
          </div>
        </button>
        <button
          onClick={() => onViewChange("grid")}
          className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === "grid"
              ? "bg-indigo-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <GridIcon />
            Grid View
          </div>
        </button>
      </nav>
    </aside>
  );
}
