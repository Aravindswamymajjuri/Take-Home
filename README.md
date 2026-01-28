# Pastebin Lite

A lightweight, shareable pastebin application built with Next.js and PostgreSQL. Create temporary text pastes with optional expiration and view limits.

## Features

- **Quick Sharing**: Create and share text with a unique URL
- **Optional Constraints**: 
  - Time-based expiry (TTL)
  - View count limits
  - Combined constraints (paste expires on first triggered limit)
- **Secure**: Content is safely rendered (XSS protection)
- **API-first**: RESTful API for programmatic access
- **Test Mode**: Deterministic time testing with `x-test-now-ms` header

## Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Neon)
- **ORM**: Prisma
- **Deployment**: Vercel

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (local or remote, e.g., Neon)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Aravindswamymajjuri/Take-Home.git
cd Take-Home
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your database URL:
```
DATABASE_URL="postgresql://user:password@host:5432/pastebin_lite?schema=public"
TEST_MODE=0
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable `DATABASE_URL` in Vercel settings
4. Deploy

Your app will be live at `https://your-app.vercel.app`

### Alternative Platforms

- **Render**: Similar to Vercel with native PostgreSQL support
- **Railway**: Easy deployment with built-in PostgreSQL

## Database

### Persistence Layer: PostgreSQL

The application uses **PostgreSQL** as the persistence layer, chosen for:
- **Reliability**: ACID compliance ensures data consistency
- **Free tier**: Neon provides free PostgreSQL hosting with generous limits
- **Scalability**: Can handle concurrent requests efficiently
- **Simplicity**: Familiar relational model for paste data

### Schema

```sql
CREATE TABLE "Paste" (
  id VARCHAR(10) PRIMARY KEY,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "ttlSeconds" INTEGER,
  "maxViews" INTEGER,
  "viewCount" INTEGER DEFAULT 0,
  "expiresAt" TIMESTAMP
);
```

## API Routes

### Health Check
```
GET /api/healthz
```
Returns application and database health status.

**Response (200):**
```json
{ "ok": true }
```

### Create Paste
```
POST /api/pastes
```

**Request:**
```json
{
  "content": "Your text here",
  "ttl_seconds": 3600,
  "max_views": 10
}
```

**Rules:**
- `content` (required): Non-empty string
- `ttl_seconds` (optional): Integer ≥ 1
- `max_views` (optional): Integer ≥ 1

**Response (201):**
```json
{
  "id": "abc123def45",
  "url": "https://your-app.vercel.app/p/abc123def45"
}
```

**Error (400):**
```json
{
  "error": "Content is required and must be a non-empty string"
}
```

### Fetch Paste (API)
```
GET /api/pastes/:id
```

**Response (200):**
```json
{
  "content": "Your text here",
  "remaining_views": 9,
  "expires_at": "2026-01-28T10:00:00.000Z"
}
```

**Notes:**
- `remaining_views` is `null` if no limit
- `expires_at` is `null` if no TTL
- Each fetch increments view count

**Errors (404):**
- Paste not found
- Paste expired
- View limit exceeded

### View Paste (HTML)
```
GET /p/:id
```

Returns HTML with the paste content safely rendered (XSS-protected).

## Design Decisions

### 1. **Request-based Test Mode**
The application uses the `x-test-now-ms` header (when `TEST_MODE=1`) to support deterministic testing. This allows:
- Precise TTL expiry testing without waiting
- Predictable behavior in test suites
- No impact on production code

### 2. **View Count on Both Endpoints**
Both API (`/api/pastes/:id`) and HTML (`/p/:id`) routes increment view counts because:
- Provides consistent behavior for shared links
- Both are legitimate ways to access paste content
- Ensures fair view limit enforcement

### 3. **Optimistic View Increment**
View count is incremented before returning the response:
- Simpler logic and fewer race conditions
- `remaining_views` calculation is straightforward
- Prevents edge cases with concurrent requests

### 4. **Content Escaping for HTML**
HTML rendering uses manual escaping to prevent XSS:
- No external HTML sanitization library needed
- Escapes: `&`, `<`, `>`, `"`, `'`
- Pre-formatted text display preserves formatting

### 5. **Composite Primary Key Not Needed**
Single `id` field as primary key chosen because:
- Pastes are independent entities
- No version history or relationships needed
- Simplifies queries and indexing

### 6. **Null vs. Boolean for Optional Constraints**
`null` is used for missing constraints instead of booleans because:
- Cleaner API semantics
- No need for separate "has_ttl" flag
- More intuitive for JSON clients

## Testing

### Manual Testing

1. **Create a paste:**
```bash
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello World","ttl_seconds":60,"max_views":5}'
```

2. **Fetch the paste:**
```bash
curl http://localhost:3000/api/pastes/abc123def45
```

3. **View in browser:**
Open `http://localhost:3000/p/abc123def45`

### Test Mode (Deterministic Time)

```bash
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -H "x-test-now-ms: 1706422800000" \
  -d '{"content":"Test","ttl_seconds":60}'
```

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── healthz/       # Health check
│   │   └── pastes/        # Paste CRUD
│   ├── p/                 # Paste viewing pages
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
├── lib/                   # Utility modules
│   ├── db.ts              # Prisma client
│   └── utils.ts           # Helper functions
├── prisma/                # Database schema
│   └── schema.prisma      # Prisma schema
├── middleware.ts          # Next.js middleware (test mode)
├── package.json
├── tsconfig.json
└── README.md
```

## Error Handling

The application gracefully handles:
- Invalid input (400)
- Missing pastes (404)
- Expired pastes (404)
- View limit exceeded (404)
- Database errors (500)
- Test mode time extraction

## Performance Considerations

- **Indexed queries**: `expiresAt` and `createdAt` fields are indexed for fast lookups
- **No automatic cleanup**: Expired pastes remain in the database (can be pruned periodically if needed)
- **Stateless API**: Scales horizontally on serverless platforms
- **Minimal dependencies**: Only essential libraries to reduce bundle size

## Security

- **XSS Protection**: HTML content is escaped to prevent script execution
- **SQL Injection**: Prisma parameterizes all queries
- **Input Validation**: Strict type checking on all inputs
- **HTTPS**: Required in production (handled by Vercel)

## Future Enhancements

- User authentication for paste management
- Syntax highlighting for code snippets
- Download as file option
- Automatic database cleanup job for expired pastes
- Rate limiting to prevent abuse
- Analytics dashboard

## License

MIT License - See [LICENSE](./LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Status**: Production-ready for the take-home assignment

For questions or issues, open an issue on GitHub.
