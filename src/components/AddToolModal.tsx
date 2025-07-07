import { useState } from 'react';
import { CreateToolDto } from '@/types/api';
import { X, Plus } from 'lucide-react';
import { useToast } from './Toast';

interface AddToolModalProps {
  onClose: () => void;
  onAdd: (tool: CreateToolDto) => void;
}

export default function AddToolModal({ onClose, onAdd }: AddToolModalProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast('warning', 'Please enter a URL');
      return;
    }

    setIsLoading(true);

    try {
      // Just pass the URL - backend will handle normalization and defaults
      const tool: CreateToolDto = {
        url: url.trim()
      };

      await onAdd(tool);
      toast('success', 'Tool added successfully!', 'The AI tool has been added to your collection');
      onClose();
    } catch (error) {
      // Handle specific error messages from the API
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('already exists')) {
        toast('info', 'Tool already exists', 'This tool has already been added to the collection');
      } else if (errorMessage.includes('Invalid URL')) {
        toast('error', 'Invalid URL', 'Please enter a valid URL format');
      } else if (errorMessage.includes('not accessible') || errorMessage.includes('does not exist')) {
        toast('error', 'Website not accessible', 'The website could not be reached. Please check the URL and try again.');
      } else if (errorMessage.includes('returned')) {
        toast('error', 'Website error', 'The website returned an error. It may be temporarily unavailable.');
      } else {
        toast('error', 'Failed to add tool', 'Please try again or check your internet connection');
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
            Add AI Tool
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
            We&apos;ll verify the website exists and automatically extract the tool name and icon.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tool URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://chat.openai.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

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