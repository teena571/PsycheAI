# PsycheAI Backend

Node.js + Express backend API for the psycheAI emotional counseling platform.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

The `.env` file has been created for you. Update these values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/psycheai?schema=public"
JWT_SECRET=your-secret-key-here
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run generate

# Run migrations
npm run migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run generate` - Generate Prisma client
- `npm run migrate` - Run database migrations
- `npm run studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/session/:id` - End chat session

### Analytics
- `GET /api/analytics/dashboard` - Get user analytics

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

### Models
- **User**: User accounts
- **Session**: Chat sessions
- **Message**: Chat messages
- **EmotionLog**: Emotion tracking

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | JWT expiration time | 15m |
| AI_SERVICE_URL | AI service URL | http://localhost:8000 |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

## Project Structure

```
backend/
├── src/
│   ├── server.js              # Application entry point
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Global error handler
│   │   └── rateLimiter.js     # Rate limiting
│   └── routes/
│       ├── auth.js            # Auth endpoints
│       ├── chat.js            # Chat endpoints
│       └── analytics.js       # Analytics endpoints
├── prisma/
│   └── schema.prisma          # Database schema
├── package.json
└── .env
```

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Zod

## Database Setup Options

### Option 1: Local PostgreSQL

1. Install PostgreSQL
2. Create database: `createdb psycheai`
3. Update DATABASE_URL in `.env`
4. Run migrations: `npm run migrate`

### Option 2: Supabase (Recommended)

1. Create account at https://supabase.com
2. Create new project
3. Copy connection string from Settings > Database
4. Update DATABASE_URL in `.env`
5. Run migrations: `npm run migrate`

### Option 3: SQLite (Testing Only)

1. Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```
2. Run migrations: `npm run migrate`

## Troubleshooting

### "Cannot find package 'express'"
Run `npm install` in the backend directory.

### "Prisma Client not generated"
Run `npm run generate`.

### "Database connection failed"
Check your DATABASE_URL in `.env` is correct.

### "Port already in use"
Change PORT in `.env` to a different port (e.g., 5001).

## Development

### Adding New Routes

1. Create route file in `src/routes/`
2. Import in `src/server.js`
3. Add to app: `app.use('/api/your-route', yourRoute)`

### Adding Middleware

1. Create middleware file in `src/middleware/`
2. Import in routes or `server.js`
3. Apply: `app.use(yourMiddleware)` or `router.use(yourMiddleware)`

### Database Changes

1. Edit `prisma/schema.prisma`
2. Run `npm run migrate`
3. Prisma will generate migration files

## Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## Deployment

See main project documentation for deployment instructions to Render.

## License

MIT
