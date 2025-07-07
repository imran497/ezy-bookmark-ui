# 🔖 EzyBookmark Frontend

> AI-powered bookmark management with intelligent categorization and seamless user experience

A Next.js application where users can discover, bookmark, and organize AI tools effortlessly. Features intelligent categorization, click analytics, and personal collections with a beautiful, responsive interface.

## Features

- 🤖 **AI-Powered Categorization**: Automatic tool categorization into 9 categories
- 🔍 **Smart Search**: Search by name, description, tags, or category
- 🏷️ **Multi-Category Filtering**: Filter by multiple categories simultaneously
- 📌 **Personal Collections**: Save and pin your favorite tools for quick access
- 📊 **Usage Analytics**: Real-time click tracking and usage statistics
- 🎨 **Beautiful Interface**: Clean, responsive design with smooth animations
- 🔐 **Secure Authentication**: Clerk integration for user management
- 📱 **Mobile Optimized**: Perfect experience on all devices
- ⚡ **Fast Performance**: Optimized with Next.js 15 and Turbopack

## Technologies Used

- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework with DaisyUI components
- **Clerk**: Authentication and user management
- **Lucide Icons**: Beautiful, consistent icon library
- **EzyBookmark API**: Custom NestJS backend for data management

## Getting Started

### Prerequisites
- Node.js 18+ 
- EzyBookmark API running on port 3001

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ToolCard.tsx      # Individual tool display with favicon
│   ├── AddToolModal.tsx  # Form to add new tools
│   ├── SearchBar.tsx     # Search functionality
│   └── StatsSection.tsx  # Usage statistics display
└── lib/
    ├── types.ts          # TypeScript interfaces
    ├── data.ts           # Initial data and categories
    └── favicon.ts        # Favicon fetching utilities
```

## Usage

1. **Browse Tools**: View all available AI tools on the main page
2. **Search**: Use the search bar to find specific tools
3. **Filter**: Select a category to filter tools
4. **Pin Tools**: Click the star icon to pin/unpin tools
5. **Add Tools**: Click "Add Tool" to submit a new AI tool
6. **Visit Tools**: Click "Visit" to go to the tool's website (increments usage count)
7. **View Stats**: See platform statistics including most popular tools and categories

## Architecture

EzyBookmark uses a modern, scalable architecture:

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: NestJS API with PostgreSQL database
- **Authentication**: Clerk for secure user management
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (Frontend) + Railway (Backend) + Supabase (Database)

## Key Features in Detail

### 🤖 AI-Powered Categorization
- Automatic categorization into 9 categories
- Smart URL validation and metadata extraction
- Enhanced fallback for sites with anti-bot protection

### 📊 Analytics & Insights
- Real-time click tracking
- Usage statistics per tool
- Popular tools rankings
- Category distribution insights

### 🔐 Security & Performance
- Clerk authentication integration
- Rate limiting and CORS protection
- Optimized API calls with caching
- Responsive design with smooth animations

## Deployment

### Frontend (Vercel)
```bash
# Build and deploy
npm run build
vercel --prod
```

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

## Contributing

We welcome contributions! Please feel free to:
- Report bugs or suggest features
- Improve the UI/UX design
- Add new functionality
- Enhance performance and accessibility

---

**EzyBookmark** - Making bookmark management effortless with AI
