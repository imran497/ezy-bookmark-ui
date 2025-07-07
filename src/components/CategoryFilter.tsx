import { X } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  categoryCounts: Record<string, number>;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
}

export default function CategoryFilter({ 
  categories, 
  categoryCounts,
  selectedCategories, 
  onCategoryToggle, 
  onClearAll 
}: CategoryFilterProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          const count = categoryCounts[category] || 0;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              <span>{category}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                isSelected 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      
      {selectedCategories.length > 0 && (
        <div className="text-sm text-gray-500">
          {selectedCategories.length} of {categories.length} categories selected
        </div>
      )}
    </div>
  );
}