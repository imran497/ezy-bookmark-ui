import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterHeaderButtonProps {
  selectedCategories: string[];
  isExpanded: boolean;
  onToggle: () => void;
}

export default function FilterHeaderButton({
  selectedCategories,
  isExpanded,
  onToggle
}: FilterHeaderButtonProps) {
  const hasActiveFilters = selectedCategories.length > 0;

  return (
    <div className="hidden sm:block">
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          hasActiveFilters
            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
        }`}
        title="Filter by category"
      >
        <Filter size={16} />
        {hasActiveFilters ? (
          <span>Filters ({selectedCategories.length})</span>
        ) : (
          <span>Filter</span>
        )}
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
    </div>
  );
}