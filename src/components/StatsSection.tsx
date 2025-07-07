import { AITool } from '@/lib/types';

interface StatsSectionProps {
  tools: AITool[];
}

export default function StatsSection({ tools }: StatsSectionProps) {
  const totalTools = tools.length;
  const totalUsage = tools.reduce((sum, tool) => sum + tool.usageCount, 0);
  const mostPopular = tools.sort((a, b) => b.usageCount - a.usageCount).slice(0, 5);
  const categoryCounts = tools.reduce((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Platform Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {totalTools}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Tools
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {totalUsage}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Visits
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {Object.keys(categoryCounts).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Categories
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {Math.round(totalUsage / totalTools) || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Avg. Usage
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Most Popular Tools
          </h3>
          <div className="space-y-2">
            {mostPopular.map((tool, index) => (
              <div key={tool.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {tool.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {tool.usageCount} visits
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Top Categories
          </h3>
          <div className="space-y-2">
            {topCategories.map(([category, count], index) => (
              <div key={category} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {category}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {count} tools
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}