/* eslint-disable react-hooks/rules-of-hooks */
import { APITool } from '@/types/api';
import ToolCard from './ToolCard';
import { MoreVertical, PinOff, X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useState, useRef, useEffect } from 'react';

interface PinnedSectionProps {
  pinnedTools: APITool[];
  onVisit?: (toolId: string) => void;
  onTogglePin?: (toolId: string) => void;
  isUnpinMode?: boolean;
  selectedToolIds?: string[];
  onToggleSelection?: (toolId: string) => void;
  onEnterUnpinMode?: () => void;
  onExitUnpinMode?: () => void;
}

export default function PinnedSection({ 
  pinnedTools, 
  onVisit, 
  onTogglePin, 
  isUnpinMode = false, 
  selectedToolIds = [], 
  onToggleSelection, 
  onEnterUnpinMode, 
  onExitUnpinMode 
}: PinnedSectionProps) {
  const { isSignedIn } = useUser();

  if (!isSignedIn || pinnedTools.length === 0) {
    return null;
  }

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

  const handleUnpinToolsClick = () => {
    setIsMenuOpen(false);
    onEnterUnpinMode?.();
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold text-base-content">
            Pinned Tools
          </h2>
          <div className="badge badge-warning badge-lg">
            {pinnedTools.length}
          </div>
        </div>

        {/* Mobile action menu */}
        {isUnpinMode ? (
          <button
            onClick={onExitUnpinMode}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors sm:hidden"
            title="Exit unpin mode"
          >
            <X size={20} />
            <span className="text-sm font-medium">Cancel</span>
          </button>
        ) : (
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
                  onClick={handleUnpinToolsClick}
                  className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <PinOff size={16} />
                  Unpin tools
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 justify-items-center">
        {pinnedTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isPinned={true}
            onVisit={onVisit}
            onTogglePin={onTogglePin}
            isSelectionMode={isUnpinMode}
            isSelected={selectedToolIds.includes(tool.id)}
            onToggleSelection={onToggleSelection}
          />
        ))}
      </div>
    </div>
  );
}