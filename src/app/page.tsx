'use client';

import { useState, useEffect } from 'react';
import { APITool, CreateToolDto } from '@/types/api';
import { apiClient } from '@/lib/api';
import ToolCard from '@/components/ToolCard';
import AddToolModal from '@/components/AddToolModal';
import PinnedSection from '@/components/PinnedSection';
import CategoryFilter from '@/components/CategoryFilter';
import FilterHeaderButton from '@/components/FilterHeaderButton';
import ToolsHeaderActions from '@/components/ToolsHeaderActions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { Plus, Search } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useToast } from '@/components/Toast';
import SelectionControls from '@/components/SelectionControls';

export default function Home() {
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const [tools, setTools] = useState<APITool[]>([]);
  const [pinnedTools, setPinnedTools] = useState<APITool[]>([]);
  const [categorizedTools, setCategorizedTools] = useState<Record<string, APITool[]>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isUnpinMode, setIsUnpinMode] = useState(false);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [selectedUnpinIds, setSelectedUnpinIds] = useState<string[]>([]);
  const [, setOriginalPinnedIds] = useState<string[]>([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load tools by categories
        const categorizedResponse = await apiClient.getToolsByCategories(100); // Load more tools since we're showing all
        setCategorizedTools(categorizedResponse);
        
        // Flatten categorized tools for search functionality
        const allTools = Object.values(categorizedResponse).flat();
        setTools(allTools);
        
        // Load pinned tools only if user is signed in
        if (isSignedIn) {
          try {
            const pinnedResponse = await apiClient.getUserPinnedTools();
            setPinnedTools(pinnedResponse.map(bookmark => bookmark.tool!));
          } catch (error) {
            console.error('Failed to load pinned tools:', error);
            setPinnedTools([]);
          }
        } else {
          setPinnedTools([]);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isSignedIn]);

  const handleAddTool = async (newTool: CreateToolDto) => {
    const createdTool = await apiClient.createTool(newTool);
    setTools(prev => [...prev, createdTool]);
    
    // Update categorized tools
    const category = createdTool.category;
    setCategorizedTools(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), createdTool]
    }));
  };

  const handleVisit = async (toolId: string) => {
    try {
      await apiClient.incrementToolUsage(toolId);
      setTools(prev => prev.map(tool =>
        tool.id === toolId
          ? { ...tool, usageCount: tool.usageCount + 1 }
          : tool
      ));
    } catch (error) {
      console.error('Failed to increment usage:', error);
    }
  };

  const handleTogglePin = async (toolId: string) => {
    if (!isSignedIn) {
      toast('info', 'Sign in required', 'Please sign in to pin tools to your collection');
      return;
    }

    // In selection mode, we don't use handleTogglePin - only for direct pin actions
    if (isSelectionMode) return;

    try {
      const isPinned = pinnedTools.some(tool => tool.id === toolId);
      await apiClient.togglePin(toolId, !isPinned);
      
      if (isPinned) {
        // Remove from pinned
        setPinnedTools(prev => prev.filter(tool => tool.id !== toolId));
        toast('success', 'Tool unpinned', 'Tool removed from your pinned collection');
      } else {
        // Add to pinned
        const tool = tools.find(t => t.id === toolId);
        if (tool) {
          setPinnedTools(prev => [...prev, tool]);
          toast('success', 'Tool pinned!', `${tool.name} added to your pinned tools`);
        }
      }
    } catch (error) {
      console.error('Failed to toggle pin:', error);
      toast('error', 'Failed to update pin status', 'Please try again or check your internet connection');
    }
  };

  const filterToolsBySearch = (toolsToFilter: APITool[]) => {
    if (!searchQuery.trim()) return toolsToFilter;
    
    return toolsToFilter.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterToolsByCategories = (toolsToFilter: APITool[]) => {
    if (selectedCategories.length === 0) return toolsToFilter;
    return toolsToFilter.filter(tool => selectedCategories.includes(tool.category));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleClearAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleToggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  const handleEnterSelectionMode = () => {
    setIsSelectionMode(true);
    setSelectedToolIds([]);
    setOriginalPinnedIds(pinnedTools.map(tool => tool.id));
  };

  const handleExitSelectionMode = () => {
    handleCancelSelection();
  };

  const handleEnterUnpinMode = () => {
    setIsUnpinMode(true);
    setSelectedUnpinIds([]);
  };

  const handleExitUnpinMode = () => {
    setIsUnpinMode(false);
    setSelectedUnpinIds([]);
  };

  const handleToggleSelection = (toolId: string) => {
    setSelectedToolIds(prev => 
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleToggleUnpinSelection = (toolId: string) => {
    setSelectedUnpinIds(prev => 
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleCancelSelection = () => {
    // Simply exit selection mode without making any changes
    setIsSelectionMode(false);
    setSelectedToolIds([]);
    setOriginalPinnedIds([]);
  };

  const handleDoneSelection = async () => {
    try {
      // Pin all selected tools
      if (selectedToolIds.length > 0) {
        await apiClient.bulkTogglePin(selectedToolIds, true);
        
        // Update local state with newly pinned tools
        const toolsToPin = tools.filter(tool => selectedToolIds.includes(tool.id));
        setPinnedTools(prev => [...prev, ...toolsToPin]);
        
        toast('success', 'Tools pinned!', `${selectedToolIds.length} tools added to your pinned collection`);
      }
    } catch (error) {
      console.error('Failed to pin tools:', error);
      toast('error', 'Failed to pin tools', 'Please try again');
    }
    
    setIsSelectionMode(false);
    setSelectedToolIds([]);
    setOriginalPinnedIds([]);
  };

  const handleDoneUnpinSelection = async () => {
    try {
      // Unpin all selected tools
      if (selectedUnpinIds.length > 0) {
        await apiClient.bulkTogglePin(selectedUnpinIds, false);
        
        // Update local state by removing unpinned tools
        setPinnedTools(prev => prev.filter(tool => !selectedUnpinIds.includes(tool.id)));
        
        toast('success', 'Tools unpinned!', `${selectedUnpinIds.length} tools removed from your pinned collection`);
      }
    } catch (error) {
      console.error('Failed to unpin tools:', error);
      toast('error', 'Failed to unpin tools', 'Please try again');
    }
    
    setIsUnpinMode(false);
    setSelectedUnpinIds([]);
  };

  const hasChanges = selectedToolIds.length > 0;
  const hasUnpinChanges = selectedUnpinIds.length > 0;

  const pinnedToolIds = pinnedTools.map(tool => tool.id);
  const unpinnedTools = tools.filter(tool => !pinnedToolIds.includes(tool.id));
  const filteredByCategories = filterToolsByCategories(unpinnedTools);
  const unpinnedToolsData = filterToolsBySearch(filteredByCategories);
  
  const categories = Object.keys(categorizedTools);
  const categoryCounts = Object.fromEntries(
    categories.map(category => [category, categorizedTools[category].length])
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-base-content/70">Loading tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl flex-1">
        {/* Pinned Tools Section */}
        <PinnedSection
          pinnedTools={pinnedTools}
          onVisit={handleVisit}
          onTogglePin={handleTogglePin}
          isUnpinMode={isUnpinMode}
          selectedToolIds={selectedUnpinIds}
          onToggleSelection={handleToggleUnpinSelection}
          onEnterUnpinMode={handleEnterUnpinMode}
          onExitUnpinMode={handleExitUnpinMode}
        />

        {/* Search Bar - Always visible */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tools..."
            />
          </div>
        </div>

        {/* Search Results Section */}
        {searchQuery ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results
              </h2>
              <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {unpinnedToolsData.length}
              </div>
            </div>
            <p className="text-gray-600">
              Results for "{searchQuery}"
            </p>
            
            {unpinnedToolsData.length > 0 ? (
              <div className="grid grid-cols-4 gap-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 justify-items-center">
                {unpinnedToolsData.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isPinned={pinnedToolIds.includes(tool.id)}
                    onVisit={handleVisit}
                    onTogglePin={handleTogglePin}
                    isSelectionMode={isSelectionMode}
                    isSelected={selectedToolIds.includes(tool.id)}
                    onToggleSelection={handleToggleSelection}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
                <p className="text-gray-600 mb-4">
                  No tools match "{searchQuery}". Try a different search term.
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        ) : (
          /* All Tools with Category Filters */
          <div className="space-y-8">
            {Object.keys(categorizedTools).length > 0 ? (
              <div className="space-y-6">
                {/* Tools Header with Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-gray-900">All Tools</h2>
                    <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {unpinnedToolsData.length} tools
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FilterHeaderButton
                      selectedCategories={selectedCategories}
                      isExpanded={filtersExpanded}
                      onToggle={handleToggleFilters}
                    />
                    <ToolsHeaderActions
                      isSelectionMode={isSelectionMode}
                      onEnterSelectionMode={handleEnterSelectionMode}
                      onExitSelectionMode={handleExitSelectionMode}
                      onToggleFilters={handleToggleFilters}
                      filterCount={selectedCategories.length}
                    />
                  </div>
                </div>

                {/* Category Filter Accordion - Desktop & Mobile */}
                <CategoryFilter
                  categories={categories}
                  categoryCounts={categoryCounts}
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                  onClearAll={handleClearAllCategories}
                  isExpanded={filtersExpanded}
                />

                {/* Tools Grid */}
                {unpinnedToolsData.length > 0 ? (
                  <div className="grid grid-cols-4 gap-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 justify-items-center">
                    {unpinnedToolsData.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isPinned={pinnedToolIds.includes(tool.id)}
                        onVisit={handleVisit}
                        onTogglePin={handleTogglePin}
                        isSelectionMode={isSelectionMode}
                        isSelected={selectedToolIds.includes(tool.id)}
                        onToggleSelection={handleToggleSelection}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
                    <p className="text-gray-600 mb-4">
                      {selectedCategories.length > 0 
                        ? `No tools found in selected categories.`
                        : 'No tools available.'
                      }
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedCategories([]);
                        setSearchQuery('');
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to EzyBookmark!</h3>
                <p className="text-gray-600 mb-6">
                  Get started by adding your first tool to build your personal collection with intelligent categorization.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                >
                  <Plus className="w-5 h-5 mr-2 inline" />
                  Add Your First Tool
                </button>
              </div>
            )}
          </div>
        )}

        {/* Floating Add Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-circle btn-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 text-white shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
            title="Add new tool"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {showAddModal && (
          <AddToolModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddTool}
            categories={categories}
          />
        )}
        
        <SelectionControls
          isVisible={isSelectionMode}
          selectedCount={selectedToolIds.length}
          hasChanges={hasChanges}
          onCancel={handleCancelSelection}
          onDone={handleDoneSelection}
        />
        
        <SelectionControls
          isVisible={isUnpinMode}
          selectedCount={selectedUnpinIds.length}
          hasChanges={hasUnpinChanges}
          onCancel={handleExitUnpinMode}
          onDone={handleDoneUnpinSelection}
        />
      </main>
      <Footer />
    </div>
  );
}
