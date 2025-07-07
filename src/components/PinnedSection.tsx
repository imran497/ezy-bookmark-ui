import { APITool } from '@/types/api';
import ToolCard from './ToolCard';
import { Pin } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface PinnedSectionProps {
  pinnedTools: APITool[];
  onVisit?: (toolId: string) => void;
  onTogglePin?: (toolId: string) => void;
}

export default function PinnedSection({ pinnedTools, onVisit, onTogglePin }: PinnedSectionProps) {
  const { isSignedIn } = useUser();

  if (!isSignedIn || pinnedTools.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-2xl font-bold text-base-content">
          Pinned Tools
        </h2>
        <div className="badge badge-warning badge-lg">
          {pinnedTools.length}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 justify-items-center">
        {pinnedTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isPinned={true}
            onVisit={onVisit}
            onTogglePin={onTogglePin}
          />
        ))}
      </div>
    </div>
  );
}