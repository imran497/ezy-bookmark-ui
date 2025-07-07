import { APITool } from '@/types/api';
import SmartIcon from './SmartIcon';
import { Pin } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface ToolCardProps {
  tool: APITool;
  isPinned?: boolean;
  onVisit?: (toolId: string) => void;
  onTogglePin?: (toolId: string) => void;
}

export default function ToolCard({ tool, isPinned = false, onVisit, onTogglePin }: ToolCardProps) {
  const { isSignedIn } = useUser();

  const handleClick = () => {
    onVisit?.(tool.id);
    window.open(tool.url, '_blank');
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin?.(tool.id);
  };

  return (
    <div className="flex flex-col items-center cursor-pointer group" onClick={handleClick}>
      <div className="relative">
        {/* iPhone-style app icon */}
        <div className="w-14 h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105 overflow-hidden bg-white">
          <SmartIcon
            url={tool.url}
            name={tool.name}
            customFavicon={tool.favicon}
            size={56}
            className="w-full h-full rounded-2xl"
          />
        </div>
        
        {/* Pin/Unpin button - show for logged in users */}
        {isSignedIn && onTogglePin && (
          <button
            onClick={handlePinClick}
            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer ${
              isPinned 
                ? 'bg-blue-600 text-white' 
                : 'bg-black/20 text-white'
            }`}
            title={isPinned ? "Unpin" : "Pin"}
          >
            <Pin size={8} className={isPinned ? 'fill-current' : ''} />
          </button>
        )}
        
      </div>
      
      {/* App name */}
      <span className="text-xs font-medium text-base-content mt-2 text-center leading-tight max-w-20">
        {tool.name}
      </span>
    </div>
  );
}