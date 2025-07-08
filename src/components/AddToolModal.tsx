import { useState } from 'react';
import { CreateToolDto } from '@/types/api';
import { X, Plus } from 'lucide-react';
import { useToast } from './Toast';

interface AddToolModalProps {
  onClose: () => void;
  onAdd: (tool: CreateToolDto) => void;
  categories?: string[];
}

export default function AddToolModal({ onClose, onAdd, categories = [] }: AddToolModalProps) {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState('');
  const { toast } = useToast();

  const validateUrl = (urlString: string): string => {
    if (!urlString.trim()) {
      return 'URL is required';
    }

    // Basic URL format validation
    try {
      const url = new URL(urlString.trim());
      if (!['http:', 'https:'].includes(url.protocol)) {
        return 'URL must use HTTP or HTTPS protocol';
      }
      if (!url.hostname) {
        return 'URL must have a valid domain name';
      }
      return '';
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (urlError) {
      setUrlError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateUrl(url);
    if (validationError) {
      setUrlError(validationError);
      return;
    }

    setIsLoading(true);
    setUrlError('');

    try {
      // Pass URL and category if selected - backend will handle normalization and defaults
      const tool: CreateToolDto = {
        url: url.trim(),
        ...(category && { category })
      };

      await onAdd(tool);
      toast('success', 'Tool added successfully!', 'The AI tool has been added to your collection');
      onClose();
    } catch (error) {
      // Handle specific error messages from the API
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('already exists')) {
        setUrlError('This tool has already been added to the collection');
      } else if (errorMessage.includes('Invalid URL')) {
        setUrlError('Please enter a valid URL format');
      } else if (errorMessage.includes('not accessible') || errorMessage.includes('does not exist')) {
        setUrlError('The website could not be reached. Please check the URL and try again.');
      } else if (errorMessage.includes('returned')) {
        setUrlError('The website returned an error. It may be temporarily unavailable.');
      } else {
        setUrlError('Failed to add tool. Please try again or check your internet connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl border border-gray-200 relative max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-3">
              <Plus className="w-4 h-4" />
            </div>
            Add Tool
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            disabled={isLoading}
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <span className="text-sm text-blue-800">
            We'll verify the website exists and automatically extract the tool name and icon.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tool URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://chat.openai.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                urlError 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              autoFocus
              disabled={isLoading}
            />
            {urlError && (
              <p className="mt-1 text-sm text-red-600 flex items-start">
                <span className="flex-shrink-0 w-4 h-4 mt-0.5 mr-1">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
                {urlError}
              </p>
            )}
          </div>

          {categories.length > 0 && (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (Optional)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              >
                <option value="">Auto-detect category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Leave blank to automatically detect the category based on the website
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Validating & Adding...
                </>
              ) : (
                'Add Tool'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}