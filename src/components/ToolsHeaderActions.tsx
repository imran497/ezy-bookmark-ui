import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pin, X, Filter } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface ToolsHeaderActionsProps {
  isSelectionMode: boolean;
  onEnterSelectionMode: () => void;
  onExitSelectionMode: () => void;
  onToggleFilters?: () => void;
  filterCount?: number;
}

export default function ToolsHeaderActions({
  isSelectionMode,
  onEnterSelectionMode,
  onExitSelectionMode,
  onToggleFilters,
  filterCount = 0
}: ToolsHeaderActionsProps) {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  if (!isSignedIn) return null;

  const handlePinToolsClick = () => {
    setIsMenuOpen(false);
    onEnterSelectionMode();
  };

  const handleFiltersClick = () => {
    setIsMenuOpen(false);
    onToggleFilters?.();
  };

  if (isSelectionMode) {
    return (
      <button
        onClick={onExitSelectionMode}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors sm:hidden"
        title="Exit selection mode"
      >
        <X size={20} />
        <span className="text-sm font-medium">Cancel</span>
      </button>
    );
  }

  return (
    <div className="relative sm:hidden" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        title="More actions"
      >
        <MoreVertical size={20} />
      </button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
          <button
            onClick={handleFiltersClick}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm transition-colors ${
              filterCount > 0 
                ? 'text-blue-700 bg-blue-50 hover:bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            {filterCount > 0 ? `Filters (${filterCount})` : 'Filter by category'}
          </button>
          <button
            onClick={handlePinToolsClick}
            className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pin size={16} />
            Pin tools
          </button>
        </div>
      )}
    </div>
  );
}