# Post Everywhere Server

A modern TypeScript-based REST API server with PostgreSQL database, featuring user authentication, post management, and comprehensive validation using Prisma ORM and Zod.

## Features

- 🚀 **TypeScript** - Full type safety and modern JavaScript features
- 🐘 **PostgreSQL** - Robust relational database with Prisma ORM
- 🔐 **JWT Authentication** - Secure user authentication with bcrypt
- 🐳 **Docker** - Containerized application and database
- 📝 **ESLint & Prettier** - Code quality and formatting
- 🏥 **Health Checks** - Application monitoring
- 🔒 **Security** - Helmet, CORS, input validation with Zod
- 🗄️ **Prisma ORM** - Type-safe database operations
- ✅ **Zod Validation** - Runtime type validation
- 🧪 **Jest Testing** - Comprehensive test suite
- 📊 **Error Handling** - Centralized error management

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL 15 with Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod schemas
- **Testing**: Jest + ts-jest
- **Containerization**: Docker & Docker Compose
- **Code Quality**: ESLint + Prettier

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd post-everywhere-server
   ```

2. **Start the application**

   ```bash
   docker-compose up -d
   ```

3. **Check the application**
   ```bash
   curl http://localhost:3000/health
   ```

### Local Development

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start PostgreSQL with Docker**

   ```bash
   docker-compose up postgres -d
   ```

4. **Generate Prisma client**

   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**

   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database (optional)**

   ```bash
   npm run db:seed
   ```

7. **Run the application**
   ```bash
   npm run dev
   ```

## Available Scripts

| Script                    | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Start development server with hot reload |
| `npm run build`           | Build the application for production     |
| `npm start`               | Start production server                  |
| `npm run lint`            | Run ESLint                               |
| `npm run lint:fix`        | Fix ESLint errors                        |
| `npm run format`          | Format code with Prettier                |
| `npm run format:check`    | Check code formatting                    |
| `npm test`                | Run tests                                |
| `npm run test:watch`      | Run tests in watch mode                  |
| `npm run docker:build`    | Build Docker image                       |
| `npm run docker:run`      | Run Docker container                     |
| `npm run prisma:generate` | Generate Prisma client                   |
| `npm run prisma:migrate`  | Run database migrations                  |
| `npm run prisma:studio`   | Open Prisma Studio                       |
| `npm run prisma:push`     | Push schema to database                  |
| `npm run db:seed`         | Seed database with sample data           |

## API Endpoints

### Health Check

- `GET /health` - Check application status

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Posts

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get single post
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

## Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/post_everywhere

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

## Database Schema

The database schema is managed through Prisma ORM. See `prisma/schema.prisma` for the complete schema definition.

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
src/
├── config/          # Configuration files
├── generated/       # Generated Prisma client
├── middleware/      # Express middleware
├── routes/          # API route handlers
├── schemas/         # Zod validation schemas
├── __tests__/       # Test files
└── index.ts         # Application entry point
```

## Docker Commands

### Start all services

```bash
docker-compose up -d
```

### View logs

```bash
docker-compose logs -f app
```

### Stop all services

```bash
docker-compose down
```

### Rebuild and restart

```bash
docker-compose down
docker-compose up --build -d
```

## Development

### Code Quality

The project uses ESLint and Prettier for code quality:

```bash
# Check for linting issues
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Database Management

The project uses Prisma for database management:

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Push schema changes
npm run prisma:push

# Seed database
npm run db:seed
```

### Testing

Run tests with Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Request validation with Zod schemas
- **Password Hashing**: bcryptjs with salt rounds
- **JWT**: Secure token-based authentication
- **SQL Injection Protection**: Parameterized queries via Prisma
- **Error Handling**: Centralized error management with proper HTTP status codes

## Error Handling

The application implements comprehensive error handling:

- Custom error classes for different error types
- Centralized error handling middleware
- Proper HTTP status codes
- User-friendly error messages
- Detailed logging for debugging

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the project's coding standards
4. Run tests and linting (`npm test && npm run lint`)
5. Commit your changes with conventional commit format
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

### Commit Message Format

Use conventional commit format:

- `feat: add new feature`
- `fix: resolve bug`
- `refactor: improve code structure`
- `docs: update documentation`
- `test: add unit tests`
- `chore: update dependencies`

## License

MIT License - see LICENSE file for details
