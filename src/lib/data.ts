import { AITool } from './types';

export const initialTools: AITool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Conversational AI assistant for various tasks',
    url: 'https://chat.openai.com',
    category: 'Conversational AI',
    tags: ['chat', 'assistant', 'writing', 'coding'],
    addedBy: 'admin',
    addedAt: new Date('2024-01-01'),
    usageCount: 1250,
    favicon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=32'
  },
  {
    id: '2',
    name: 'Claude',
    description: 'AI assistant for analysis, writing, and coding',
    url: 'https://claude.ai',
    category: 'Conversational AI',
    tags: ['chat', 'assistant', 'analysis', 'coding'],
    addedBy: 'admin',
    addedAt: new Date('2024-01-01'),
    usageCount: 890,
    favicon: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=32'
  },
  {
    id: '3',
    name: 'Midjourney',
    description: 'AI-powered image generation tool',
    url: 'https://midjourney.com',
    category: 'Image Generation',
    tags: ['art', 'design', 'images', 'creative'],
    addedBy: 'admin',
    addedAt: new Date('2024-01-01'),
    usageCount: 675,
    favicon: 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=32'
  },
  {
    id: '4',
    name: 'GitHub Copilot',
    description: 'AI pair programmer for code completion',
    url: 'https://copilot.github.com',
    category: 'Code Assistant',
    tags: ['coding', 'programming', 'autocomplete', 'development'],
    addedBy: 'admin',
    addedAt: new Date('2024-01-01'),
    usageCount: 543,
    favicon: 'https://www.google.com/s2/favicons?domain=github.com&sz=32'
  },
  {
    id: '5',
    name: 'Notion AI',
    description: 'AI writing assistant integrated with Notion',
    url: 'https://notion.so',
    category: 'Writing Assistant',
    tags: ['writing', 'productivity', 'notes', 'organization'],
    addedBy: 'admin',
    addedAt: new Date('2024-01-01'),
    usageCount: 432,
    favicon: 'https://www.google.com/s2/favicons?domain=notion.so&sz=32'
  }
];

export const categories = [
  'Conversational AI',
  'Image Generation',
  'Code Assistant',
  'Writing Assistant',
  'Data Analysis',
  'Audio/Video',
  'Design Tools',
  'Productivity',
  'Research',
  'Other'
];