# AutoSphere - Futuristic News Website

A sleek, modern news website that delivers daily rewritten news in AI, Design, and Construction.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Dark/Light Mode**: Smooth theme switching with system preference detection
- **Hero Carousel**: Auto-sliding carousel showcasing top trending stories
- **Interactive News Grid**: Dynamic news cards with hover effects and category badges
- **Real-time Updates**: Live article updates using Supabase real-time subscriptions
- **Database Integration**: Full CRUD operations with Supabase PostgreSQL
- **API Integration**: RESTful endpoints for automated article publishing

## API Endpoint

### POST /api/articles

Accepts new articles from external automation tools (like n8n).

**Endpoint URL**: `https://your-supabase-url.supabase.co/functions/v1/articles`

**Request Format**:
```json
{
  "title": "Article Title",
  "content": "Full article content...",
  "author": "Author Name",
  "category": "AI" | "Design" | "Construction",
  "published_date": "2025-01-27T10:00:00Z",
  "image_url": "https://example.com/image.jpg",
  "summary": "Optional article summary"
}
```

**Required Fields**:
- `title` (string): Article headline
- `content` (string): Full article text
- `author` (string): Author name
- `category` (string): Must be one of "AI", "Design", or "Construction"
- `published_date` (string): ISO 8601 timestamp

**Optional Fields**:
- `image_url` (string): Valid URL to article image (defaults to category-specific image)
- `summary` (string): Article summary (auto-generated from content if not provided)

**Response Format**:
```json
{
  "success": true,
  "message": "Article published successfully",
  "article": {
    "id": 123,
    "title": "Article Title",
    "category": "AI",
    "slug": "article-title",
    "image_url": "https://example.com/image.jpg",
    "published_date": "2025-01-27T10:00:00Z",
    "created_at": "2025-01-27T10:00:00.123Z"
  }
}
```

**Error Response**:
```json
{
  "error": "Missing required fields",
  "missing": ["title", "content"]
}
```

### GET /api/articles

Retrieve articles with pagination and filtering.

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Articles per page (default: 9)
- `category` (string): Filter by category ("AI", "Design", "Construction")

**Response Format**:
```json
{
  "articles": [...],
  "pagination": {
    "page": 1,
    "limit": 9,
    "total": 25,
    "hasMore": true
  }
}
```

## n8n Integration

To integrate with n8n workflows:

1. Use the HTTP Request node
2. Set method to POST
3. Set URL to your Supabase edge function URL
4. Add the required JSON payload with these fields:
   ```json
   {
     "title": "Your Article Title",
     "content": "Full article content here...",
     "author": "Author Name",
     "category": "AI",
     "published_date": "2025-01-27T10:00:00Z",
     "image_url": "https://example.com/optional-image.jpg"
   }
   ```
5. Set Content-Type header to `application/json`

## Database Schema

The application uses Supabase with the following table structure:

### Articles Table
- `id` (SERIAL PRIMARY KEY)
- `title` (TEXT NOT NULL)
- `content` (TEXT NOT NULL)
- `summary` (TEXT) - Auto-generated if not provided
- `author` (TEXT NOT NULL)
- `category` (TEXT NOT NULL) - CHECK constraint for AI/Design/Construction
- `image_url` (TEXT) - Optional image URL
- `slug` (TEXT NOT NULL UNIQUE) - Auto-generated from title
- `published_date` (TIMESTAMPTZ NOT NULL)
- `created_at` (TIMESTAMPTZ DEFAULT now())
- `updated_at` (TIMESTAMPTZ DEFAULT now())

### Security Features
- Row Level Security (RLS) enabled
- Public read access for all articles
- Authenticated users can create articles
- Authors can update/delete their own articles
- Automatic slug generation from titles
- Automatic summary generation from content

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Real-time**: Supabase Realtime subscriptions
- **Build Tool**: Vite
- **Deployment**: Netlify

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── Header.tsx    # Navigation header
│   ├── HeroCarousel.tsx
│   ├── NewsCard.tsx
│   ├── NewsGrid.tsx
│   ├── ArticlePage.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
├── hooks/
│   └── useArticles.ts # Article management hook with real-time updates
├── lib/
│   └── supabase.ts   # Supabase client configuration
└── App.tsx

supabase/
├── functions/
│   └── articles/
│       └── index.ts   # API endpoint for article CRUD operations
└── migrations/
    └── *.sql         # Database schema and policies
```

## Real-time Features

The application includes real-time functionality:
- New articles appear automatically without page refresh
- Live updates using Supabase real-time subscriptions
- Optimistic UI updates for better user experience

## Deployment

The site is deployed on Netlify and ready for production use. The Supabase edge functions handle all API operations with proper CORS support for cross-origin requests.