// No imports needed - this component only renders filter badges

interface CategoryFilterProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
  isExpanded?: boolean;
}

export default function CategoryFilter({
  categories,
  categoryCounts,
  selectedCategories,
  onCategoryToggle,
  onClearAll,
  isExpanded = false
}: CategoryFilterProps) {
  
  if (categories.length === 0) return null;

  const hasActiveFilters = selectedCategories.length > 0;
  
  return (
    <div className="mb-6">
      {/* Expanded Filter Options - Show on both desktop and mobile */}
      {isExpanded && (
        <div className="mt-4 px-4">
          <div className="bg-white p-4">
            {/* Clear all button - only show when filters are active */}
            {hasActiveFilters && (
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">
                  {selectedCategories.length} of {categories.length} categories selected
                </span>
                <button
                  onClick={onClearAll}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
            
            {/* Category filter badges */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category);
                const count = categoryCounts[category] || 0;
                
                return (
                  <button
                    key={category}
                    onClick={() => onCategoryToggle(category)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                      isSelected
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}