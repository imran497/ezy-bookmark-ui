import { APITool } from '@/types/api';
import SmartIcon from './SmartIcon';
import { Pin } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface ToolCardProps {
  tool: APITool;
  isPinned?: boolean;
  onVisit?: (toolId: string) => void;
  onTogglePin?: (toolId: string) => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (toolId: string) => void;
}

export default function ToolCard({ 
  tool, 
  isPinned = false, 
  onVisit, 
  onTogglePin,
  isSelectionMode = false, 
  isSelected = false, 
  onToggleSelection 
}: ToolCardProps) {
  const { isSignedIn } = useUser();

  const handleClick = () => {
    if (isSelectionMode) {
      onToggleSelection?.(tool.id);
    } else {
      onVisit?.(tool.id);
      window.open(tool.url, '_blank');
    }
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin?.(tool.id);
  };

  return (
    <div className="flex flex-col items-center cursor-pointer group" onClick={handleClick}>
      <div className="relative">
        {/* iPhone-style app icon */}
        <div className={`w-14 h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105 overflow-hidden bg-white ${
          isSelectionMode && isSelected ? 'ring-2 ring-blue-500' : ''
        }`}>
          <SmartIcon
            url={tool.url}
            name={tool.name}
            customFavicon={tool.favicon}
            size={56}
            className="w-full h-full rounded-2xl"
          />
        </div>
        
        {/* Desktop hover pin/unpin button - hidden on mobile */}
        {!isSelectionMode && isSignedIn && onTogglePin && (
          <button
            onClick={handlePinClick}
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hidden sm:flex opacity-0 group-hover:opacity-100 ${
              isPinned 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-black/20 text-white hover:bg-black/40'
            }`}
            title={isPinned ? "Unpin" : "Pin"}
          >
            <Pin size={8} className={isPinned ? 'fill-current' : ''} />
          </button>
        )}

        {/* Selection indicator */}
        {isSelectionMode && isSelected && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
      </div>
      
      {/* App name */}
      <span className="text-xs font-medium text-base-content mt-2 text-center leading-tight max-w-20">
        {tool.name}
      </span>
    </div>
  );
}