import { X, Check } from 'lucide-react';

interface SelectionControlsProps {
  isVisible: boolean;
  selectedCount: number;
  hasChanges: boolean;
  onCancel: () => void;
  onDone: () => void;
}

export default function SelectionControls({
  isVisible,
  selectedCount,
  hasChanges,
  onCancel,
  onDone
}: SelectionControlsProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-gray-200 rounded-full shadow-lg px-6 py-3 flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">
          {selectedCount} selected
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            title="Cancel"
          >
            <X size={20} className="text-gray-600" />
          </button>
          
          {hasChanges && (
            <button
              onClick={onDone}
              className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
              title="Done"
            >
              <Check size={20} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}