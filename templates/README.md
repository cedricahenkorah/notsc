# {{ projectName }}

A Node.js TypeScript API built with Express.

## Features

- ✅ TypeScript support
- 🧱 Modular architecture (controllers, routes, services)
- 📦 {% if database and databaseType == "MongoDB" %}Database setup (MongoDB){% elif database and databaseType == "PostgreSQL (Prisma ORM)" %}Database setup (PostgreSQL with Prisma ORM){% else %}No database setup{% endif %}
- 🌐 {% if swagger %}Swagger/OpenAPI documentation{% else %}No Swagger setup{% endif %}
- 🔄 {% if redis %}Redis setup{% else %}No Redis setup{% endif %}
- 🧪 {% if jest %}Jest testing setup{% else %}No testing setup{% endif %}
- 🐳 {% if docker %}Docker setup{% else %}No Docker setup{% endif %}
- 🎯 ESLint + Prettier setup
- 🔁 Nodemon for development

## Getting Started

### Prerequisites

- Node.js (v16 or higher){% if database and databaseType == "MongoDB" %}
- MongoDB{% elif database and databaseType == "PostgreSQL (Prisma ORM)" %}
- PostgreSQL database{% endif %}{% if redis %}
- Redis{% endif %}

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   {{ packageManager }} install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration.{% if database and databaseType == "PostgreSQL (Prisma ORM)" %}

4. Set up the database:

   ````bash
   # Generate Prisma client
   {{ packageManager }} run db:generate

   # Push the schema to your database
   {{ packageManager }} run db:push

   # (Optional) Seed the database with sample data
   {{ packageManager }} run db:seed
   ```{% endif %}
   ````

### Development

Start the development server:

```bash
{{ packageManager }} run dev
```

The API will be available at `http://localhost:3000`.{% if database and databaseType == "PostgreSQL (Prisma ORM)" %}

### Database Management

- **Generate Prisma client**: `{{ packageManager }} run db:generate`
- **Push schema changes**: `{{ packageManager }} run db:push`
- **Run migrations**: `{{ packageManager }} run db:migrate`
- **Open Prisma Studio**: `{{ packageManager }} run db:studio`
- **Seed database**: `{{ packageManager }} run db:seed`

### Database Schema

The project includes a basic schema with User and Post models. You can modify the schema in `prisma/schema.prisma` and run migrations to update your database.{% endif %}

## Available Scripts

- `{{ packageManager }} start` - Start production server
- `{{ packageManager }} run dev` - Start development server with hot reload
- `{{ packageManager }} run build` - Build for production
- `{{ packageManager }} run lint` - Run ESLint
- `{{ packageManager }} run format` - Format code with Prettier{% if jest %}
- `{{ packageManager }} test` - Run tests
- `{{ packageManager }} run test:watch` - Run tests in watch mode{% endif %}{% if database and databaseType == "PostgreSQL (Prisma ORM)" %}
- `{{ packageManager }} run db:generate` - Generate Prisma client
- `{{ packageManager }} run db:push` - Push schema to database
- `{{ packageManager }} run db:migrate` - Run database migrations
- `{{ packageManager }} run db:studio` - Open Prisma Studio
- `{{ packageManager }} run db:seed` - Seed database with sample data{% endif %}

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middlewares/     # Custom middleware
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── __tests__/       # Test files{% if jest %} (Jest){% endif %}
├── app.ts           # Express app setup
└── server.ts        # Server entry point{% if database and databaseType == "PostgreSQL (Prisma ORM)" %}
prisma/
├── schema.prisma    # Database schema
└── seed.ts          # Database seeding script{% endif %}
```

## API Endpoints

- `GET /health` - Health check endpoint{% if swagger %}

### API Documentation

When running in development mode, visit `http://localhost:3000/api-docs` to view the Swagger documentation.{% endif %}

## License

MIT
