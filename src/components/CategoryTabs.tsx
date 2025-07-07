import { useState, useRef, useEffect } from 'react';
import { APITool } from '@/types/api';
import ToolCard from './ToolCard';
import { ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';

interface CategoryTabsProps {
  categorizedTools: Record<string, APITool[]>;
  pinnedToolIds: string[];
  onVisit: (toolId: string) => void;
  onTogglePin: (toolId: string) => void;
}

export default function CategoryTabs({ 
  categorizedTools, 
  pinnedToolIds, 
  onVisit, 
  onTogglePin 
}: CategoryTabsProps) {
  const categories = Object.keys(categorizedTools);
  const [activeTab, setActiveTab] = useState(categories[0] || '');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [visibleTabs, setVisibleTabs] = useState({ start: 0, end: 3 });
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Update active tab when currentTabIndex changes
  useEffect(() => {
    if (categories[currentTabIndex]) {
      setActiveTab(categories[currentTabIndex]);
    }
  }, [currentTabIndex, categories]);

  // Calculate visible tabs based on screen size and content length
  useEffect(() => {
    const updateVisibleTabs = () => {
      const width = window.innerWidth;
      let tabsToShow = 2; // default for mobile
      
      // Adjust based on screen size and category name lengths
      const avgCategoryLength = categories.reduce((acc, cat) => acc + cat.length, 0) / categories.length;
      
      if (width >= 1200) {
        tabsToShow = avgCategoryLength > 15 ? 4 : 5; // xl screens
      } else if (width >= 1024) {
        tabsToShow = avgCategoryLength > 15 ? 3 : 4; // lg screens
      } else if (width >= 768) {
        tabsToShow = avgCategoryLength > 12 ? 2 : 3; // md screens
      } else if (width >= 640) {
        tabsToShow = 2; // sm screens
      } else {
        tabsToShow = avgCategoryLength > 10 ? 1 : 2; // mobile
      }
      
      const maxStart = Math.max(0, categories.length - tabsToShow);
      const start = Math.min(Math.max(0, currentTabIndex - Math.floor(tabsToShow / 2)), maxStart);
      const end = Math.min(start + tabsToShow, categories.length);
      
      setVisibleTabs({ start, end });
    };

    updateVisibleTabs();
    window.addEventListener('resize', updateVisibleTabs);
    return () => window.removeEventListener('resize', updateVisibleTabs);
  }, [currentTabIndex, categories]);

  const navigateTab = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentTabIndex > 0) {
      setCurrentTabIndex(currentTabIndex - 1);
    } else if (direction === 'next' && currentTabIndex < categories.length - 1) {
      setCurrentTabIndex(currentTabIndex + 1);
    }
  };

  const selectTab = (index: number) => {
    setCurrentTabIndex(index);
  };

  const toggleExpanded = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getDisplayedTools = (category: string, tools: APITool[]) => {
    const isExpanded = expandedCategories.has(category);
    const toolsPerRow = 12;
    const maxToolsToShow = toolsPerRow * 2; // 2 rows max
    
    return isExpanded ? tools : tools.slice(0, maxToolsToShow);
  };

  const hasMoreTools = (category: string, tools: APITool[]) => {
    const toolsPerRow = 12;
    const maxToolsToShow = toolsPerRow * 2;
    return tools.length > maxToolsToShow;
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Carousel Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex items-center">
          {/* Previous Button */}
          <button
            onClick={() => navigateTab('prev')}
            disabled={currentTabIndex === 0}
            className={`p-2 rounded-lg transition-colors mr-2 ${
              currentTabIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Tab Container */}
          <div className="flex-1 overflow-hidden">
            <nav className="-mb-px flex transition-transform duration-300" ref={tabsContainerRef}>
              {categories.slice(visibleTabs.start, visibleTabs.end).map((category, index) => {
                const actualIndex = visibleTabs.start + index;
                return (
                  <button
                    key={category}
                    onClick={() => selectTab(actualIndex)}
                    className={`flex-1 py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 min-w-0 cursor-pointer ${
                      activeTab === category
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center min-w-0">
                      <span className="text-center truncate min-w-0 text-xs sm:text-sm">
                        {category}
                      </span>
                      <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-1.5 rounded-full text-xs flex-shrink-0">
                        {categorizedTools[category].length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Next Button */}
          <button
            onClick={() => navigateTab('next')}
            disabled={currentTabIndex === categories.length - 1}
            className={`p-2 rounded-lg transition-colors ml-2 ${
              currentTabIndex === categories.length - 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Tab Content */}
      {activeTab && categorizedTools[activeTab] && (
        <div className="space-y-6">
          {/* Category Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab}
              </h2>
              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                {categorizedTools[activeTab].length} tools
              </div>
            </div>
            
            {hasMoreTools(activeTab, categorizedTools[activeTab]) && (
              <button
                onClick={() => toggleExpanded(activeTab)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                {expandedCategories.has(activeTab) ? (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    Show More ({categorizedTools[activeTab].length - 24})
                  </>
                )}
              </button>
            )}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-4 gap-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 justify-items-center">
            {getDisplayedTools(activeTab, categorizedTools[activeTab]).map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                isPinned={pinnedToolIds.includes(tool.id)}
                onVisit={onVisit}
                onTogglePin={onTogglePin}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}