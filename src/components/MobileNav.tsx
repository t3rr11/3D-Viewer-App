import { useState, useEffect } from "react";
import TableIcon from "./icons/TableIcon";
import GridIcon from "./icons/GridIcon";

interface MobileNavProps {
  activeView: "table" | "grid";
  onViewChange: (view: "table" | "grid") => void;
}

export default function MobileNav({ activeView, onViewChange }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.mobile-nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleViewChange = (view: "table" | "grid") => {
    onViewChange(view);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="mobile-nav lg:hidden fixed top-4 right-4 z-50 p-3 bg-gray-900 border border-gray-800 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="mobile-nav fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <aside
        className={`mobile-nav fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 pt-20">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            View Mode
          </h2>
          <nav className="space-y-2">
            <button
              onClick={() => handleViewChange("table")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeView === "table"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <TableIcon />
                <span>Table View</span>
              </div>
            </button>
            <button
              onClick={() => handleViewChange("grid")}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                activeView === "grid"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <GridIcon />
                <span>Grid View</span>
              </div>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
