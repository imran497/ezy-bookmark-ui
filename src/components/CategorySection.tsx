import { useState } from 'react';
import { APITool } from '@/types/api';
import ToolCard from './ToolCard';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface CategorySectionProps {
  categoryName: string;
  tools: APITool[];
  pinnedToolIds: string[];
  onVisit: (toolId: string) => void;
  onTogglePin: (toolId: string) => void;
  isSelectionMode?: boolean;
  selectedToolIds?: string[];
  onToggleSelection?: (toolId: string) => void;
}

export default function CategorySection({ 
  categoryName, 
  tools, 
  pinnedToolIds, 
  onVisit, 
  onTogglePin,
  isSelectionMode = false,
  selectedToolIds = [],
  onToggleSelection
}: CategorySectionProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Calculate tools per row based on screen size (using same grid as main page)
  const toolsPerRow = 12; // xl:grid-cols-12
  const maxToolsToShow = toolsPerRow * 2; // 2 rows max
  
  const displayedTools = showAll ? tools : tools.slice(0, maxToolsToShow);
  const hasMoreTools = tools.length > maxToolsToShow;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {categoryName}
          </h2>
          <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
            {tools.length}
          </div>
        </div>
        
        {hasMoreTools && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            {showAll ? (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4" />
                Show More ({tools.length - maxToolsToShow})
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-4 gap-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 justify-items-center">
        {displayedTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isPinned={pinnedToolIds.includes(tool.id)}
            onVisit={onVisit}
            isSelectionMode={isSelectionMode}
            isSelected={selectedToolIds.includes(tool.id)}
            onToggleSelection={onToggleSelection}
          />
        ))}
      </div>
    </div>
  );
}