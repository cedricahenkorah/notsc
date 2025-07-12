import { TemplateData } from './types';

export function getTemplates(data: TemplateData): Record<string, string> {
  const templates: Record<string, string> = {};

  // Package.json
  templates['package.json'] = generatePackageJson(data);

  // TypeScript config
  templates['tsconfig.json'] = generateTsConfig();

  // Source files
  templates['src/app.ts'] = generateAppFile(data);
  templates['src/server.ts'] = generateServerFile(data);
  templates['src/config/database.ts'] = generateDatabaseConfig(data);
  templates['src/config/redis.ts'] = generateRedisConfig(data);
  templates['src/controllers/healthController.ts'] = generateHealthController();
  templates['src/routes/healthRoutes.ts'] = generateHealthRoutes();
  templates['src/routes/index.ts'] = generateRoutesIndex(data);
  templates['src/middlewares/errorHandler.ts'] = generateErrorHandler();
  templates['src/middlewares/requestLogger.ts'] = generateRequestLogger();
  templates['src/services/healthService.ts'] = generateHealthService();
  templates['src/types/index.ts'] = generateTypesIndex();
  templates['src/utils/logger.ts'] = generateLogger();
  templates['src/utils/api-response.ts'] = generateApiResponse();

  // Configuration files
  templates['.env.example'] = generateEnvExample(data);
  templates['.gitignore'] = generateGitignore();
  templates['.eslintrc.js'] = generateEslintConfig();
  templates['.prettierrc'] = generatePrettierConfig();
  templates['nodemon.json'] = generateNodemonConfig();

  // Testing files (if Jest is selected)
  if (data.jest) {
    templates['jest.config.js'] = generateJestConfig();
    templates['src/__tests__/health.test.ts'] = generateHealthTest();
  }

  // Docker files (if Docker is selected)
  if (data.docker) {
    templates['Dockerfile'] = generateDockerfile();
    templates['.dockerignore'] = generateDockerignore();
    templates['docker-compose.yml'] = generateDockerCompose(data);
  }

  // README
  templates['README.md'] = generateReadme(data);

  return templates;
}

function generatePackageJson(data: TemplateData): string {
  const dependencies = [
    'express',
    'cors',
    'helmet',
    'dotenv',
    'winston',
    'winston-daily-rotate-file',
  ];

  const devDependencies = [
    '@types/express',
    '@types/cors',
    '@types/node',
    'typescript',
    'ts-node',
    'nodemon',
  ];

  if (data.database) {
    dependencies.push('mongoose');
    devDependencies.push('@types/mongoose');
  }

  if (data.swagger) {
    dependencies.push('swagger-jsdoc', 'swagger-ui-express');
    devDependencies.push('@types/swagger-jsdoc', '@types/swagger-ui-express');
  }

  if (data.redis) {
    dependencies.push('ioredis');
    devDependencies.push('@types/ioredis');
  }

  if (data.jest) {
    devDependencies.push(
      'jest',
      'ts-jest',
      '@types/jest',
      'supertest',
      '@types/supertest'
    );
  }

  const scripts: Record<string, string> = {
    start: 'node dist/server.js',
    dev: 'nodemon src/server.ts',
    build: 'tsc',
    lint: 'eslint src/**/*.ts',
    format: 'prettier --write src/**/*.ts',
  };

  if (data.jest) {
    scripts.test = 'jest';
    scripts['test:watch'] = 'jest --watch';
  }

  return JSON.stringify(
    {
      name: data.projectName,
      version: '1.0.0',
      description: 'A Node.js TypeScript API',
      main: 'dist/server.js',
      scripts,
      dependencies: dependencies.reduce(
        (acc, dep) => ({ ...acc, [dep]: 'latest' }),
        {}
      ),
      devDependencies: devDependencies.reduce(
        (acc, dep) => ({ ...acc, [dep]: 'latest' }),
        {}
      ),
      keywords: ['nodejs', 'typescript', 'api', 'express'],
      author: '',
      license: 'MIT',
    },
    null,
    2
  );
}

function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        lib: ['ES2020'],
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist', '**/*.test.ts'],
    },
    null,
    2
  );
}

function generateAppFile(data: TemplateData): string {
  let imports = `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';`;

  if (data.swagger) {
    imports += `
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';`;
  }

  imports += `
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';`;

  let swaggerSetup = '';
  if (data.swagger) {
    swaggerSetup = `
// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '${data.projectName} API',
      version: '1.0.0',
      description: 'A Node.js TypeScript API',
    },
    servers: [
      {
        url: 'http://localhost:${process.env.PORT || 3000}',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);`;
  }

  let swaggerRoute = '';
  if (data.swagger) {
    swaggerRoute = `
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));`;
  }

  return `${imports}

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

${swaggerSetup}
${swaggerRoute}

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;
`;
}

function generateServerFile(data: TemplateData): string {
  let imports = `import 'dotenv/config';
import http from 'http';
import app from './app';`;

  if (data.database) {
    imports += `
import mongoose from 'mongoose';
import { connectDatabase } from './config/database';`;
  }

  if (data.redis) {
    imports += `
import { connectRedis } from './config/redis';`;
  }

  imports += `
import { logger } from './utils/logger';`;

  let databaseConnectionHandlers = '';
  if (data.database) {
    databaseConnectionHandlers = `
mongoose.connection.once('open', () => {
  logger.info('MongoDB connection ready');
});

mongoose.connection.on('error', (err: any) => {
  logger.error('MongoDB connection error', err);
});`;
  }

  let databaseSetup = '';
  if (data.database) {
    databaseSetup = `
  connectDatabase();`;
  }

  let redisSetup = '';
  if (data.redis) {
    redisSetup = `
  await connectRedis();`;
  }

  return `${imports}

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

${databaseConnectionHandlers}

async function startServer() {
  try {${databaseSetup}${redisSetup}
    server.listen(PORT, () => {
      logger.info(\`🚀 ${data.projectName} is running on port \${PORT}\`);
      ${data.swagger ? `logger.info(\`📚 API Documentation available at http://localhost:\${PORT}/api-docs\`);` : ''}
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
`;
}

function generateDatabaseConfig(data: TemplateData): string {
  if (!data.database) {
    return `// Database configuration not included in this project
export const connectDatabase = async () => {
  console.log('Database connection not configured');
};`;
  }

  return `import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/${data.projectName}';
    await mongoose.connect(mongoUri);
  } catch (error) {
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info('✅ Disconnected from MongoDB');
  } catch (error) {
    logger.error('❌ MongoDB disconnection error:', error);
  }
};`;
}

function generateRedisConfig(data: TemplateData): string {
  if (!data.redis) {
    return `// Redis configuration not included in this project
export const connectRedis = async () => {
  console.log('Redis connection not configured');
};`;
  }

  return `import IORedis from 'ioredis';
import { logger } from '../utils/logger';

const redisConnection = new IORedis({
  maxRetriesPerRequest: null,
  port: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : undefined,
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB, 10) : 0,
});

redisConnection.on('connect', () => {
  logger.info('✅ Connected to Redis');
});

redisConnection.on('error', (err) => {
  logger.error('❌ Redis connection error:', err);
});

redisConnection.on('close', () => {
  logger.info('🔌 Redis connection closed');
});

export const connectRedis = async () => {
  try {
    // Test the connection
    await redisConnection.ping();
  } catch (error) {
    process.exit(1);
  }
};

export const getRedisClient = () => redisConnection;

export const disconnectRedis = async () => {
  try {
    await redisConnection.quit();
    logger.info('✅ Disconnected from Redis');
  } catch (error) {
    logger.error('❌ Redis disconnection error:', error);
  }
};

export default redisConnection;`;
}

function generateHealthController(): string {
  return `import { Request, Response } from 'express';
import { getHealthStatus } from '../services/healthService';
import { successResponse, errorResponse } from '../utils/api-response';

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 code:
 *                   type: number
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *                     uptime:
 *                       type: number
 *                     environment:
 *                       type: string
 */
export const getHealth = async (req: Request, res: Response) => {
  try {
    const health = await getHealthStatus();
    successResponse(res, 200, 'Health check successful', health);
  } catch (error) {
    errorResponse(res, 500, 'Health check failed');
  }
};`;
}

function generateHealthRoutes(): string {
  return `import { Router } from 'express';
import { getHealth } from '../controllers/healthController';

const router = Router();

router.get('/health', getHealth);

export default router;`;
}

function generateRoutesIndex(data: TemplateData): string {
  return `import { Router } from 'express';
import healthRoutes from './healthRoutes';

const router = Router();

router.use('/', healthRoutes);

// Add more routes here
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

export default router;`;
}

function generateErrorHandler(): string {
  return `import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/api-response';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  errorResponse(res, statusCode, message);
};`;
}

function generateRequestLogger(): string {
  return `import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(\`\${req.method} \${req.originalUrl} \${res.statusCode} - \${duration}ms\`);
  });
  
  next();
};`;
}

function generateHealthService(): string {
  return `export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export const getHealthStatus = async (): Promise<HealthStatus> => {
  return {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };
};`;
}

function generateTypesIndex(): string {
  return `// Export all types here
export * from './health';
export * from '../utils/api-response';`;
}

function generateLogger(): string {
  return `import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return \`[\${timestamp}] \${level.toUpperCase()}: \${message}\`;
    })
  ),
  transports: [
    new winston.transports.Console({
      silent: isProduction,
    }),
    ...(isProduction
      ? [
          new DailyRotateFile({
            filename: 'logs/%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
          }),
        ]
      : []),
  ],
});

export const stream = {
  write: (message: string) => {
    // Log HTTP requests at "info" level
    logger.info(message.trim());
  },
};`;
}

function generateApiResponse(): string {
  return `import { Response } from 'express';

export type ApiResponse<T = undefined> = {
  status: 'success' | 'error';
  code: number;
  message?: string;
  data?: T;
};

export function successResponse<T>(
  res: Response,
  code: number,
  message?: string,
  data?: T
): void {
  const response: ApiResponse<T> = {
    status: 'success',
    code,
    message: message || 'success',
    data,
  };
  res.status(code).json(response);
}

export function errorResponse(
  res: Response,
  code: number,
  message: string
): void {
  const response: ApiResponse = { status: 'error', code, message };
  res.status(code).json(response);
}`;
}

function generateEnvExample(data: TemplateData): string {
  let envContent = `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration${
    data.database
      ? `
MONGODB_URI=mongodb://localhost:27017/${data.projectName}`
      : ''
  }${
    data.redis
      ? `
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0`
      : ''
  }

# Logging Configuration
# LOG_LEVEL=info

# JWT Configuration (if needed)
# JWT_SECRET=your-secret-key
# JWT_EXPIRES_IN=7d

# API Configuration
# API_KEY=your-api-key
`;

  return envContent;
}

function generateGitignore(): string {
  return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build outputs
dist/
build/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Temporary files
tmp/
temp/`;
}

function generateEslintConfig(): string {
  return `module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
};`;
}

function generatePrettierConfig(): string {
  return `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}`;
}

function generateNodemonConfig(): string {
  return `{
  "watch": ["src"],
  "ext": "ts,js",
  "ignore": ["src/**/*.test.ts"],
  "exec": "ts-node src/server.ts"
}`;
}

function generateJestConfig(): string {
  return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};`;
}

function generateHealthTest(): string {
  return `import request from 'supertest';
import express from 'express';
import { getHealth } from '../../controllers/healthController';

const app = express();
app.use(express.json());
app.get('/health', getHealth);

describe('Health Controller', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body.status).toBe('OK');
  });
});`;
}

function generateDockerfile(): string {
  return `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]`;
}

function generateDockerignore(): string {
  return `node_modules
npm-debug.log
dist
.git
.gitignore
README.md
.env
.nyc_output
coverage
.DS_Store`;
}

function generateDockerCompose(data: TemplateData): string {
  let services = `  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000`;

  if (data.database) {
    services += `
    depends_on:
      - mongodb`;
  }

  if (data.redis) {
    services += `
    depends_on:
      - redis`;
  }

  let additionalServices = '';
  if (data.database) {
    additionalServices += `
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db`;
  }

  if (data.redis) {
    additionalServices += `
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"`;
  }

  let volumes = '';
  if (data.database) {
    volumes = `
volumes:
  mongodb_data:`;
  }

  return `version: '3.8'

services:${services}${additionalServices}${volumes}`;
}

function generateReadme(data: TemplateData): string {
  return `# ${data.projectName}

A Node.js TypeScript API built with Express.

## Features

- ✅ TypeScript support
- 🧱 Modular architecture (controllers, routes, services)
- 📦 ${data.database ? 'Database setup (MongoDB)' : 'No database setup'}
- 🌐 ${data.swagger ? 'Swagger/OpenAPI documentation' : 'No Swagger setup'}
- 🔄 ${data.redis ? 'Redis setup' : 'No Redis setup'}
- 🧪 ${data.jest ? 'Jest testing setup' : 'No testing setup'}
- 🐳 ${data.docker ? 'Docker setup' : 'No Docker setup'}
- 🎯 ESLint + Prettier setup
- 🔁 Nodemon for development

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- ${data.database ? 'MongoDB' : ''}${data.redis ? 'Redis' : ''}

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   ${data.packageManager} install
   \`\`\`

3. Copy environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Start the development server:
   \`\`\`bash
   ${data.packageManager} run dev
   \`\`\`

The server will start on http://localhost:3000${data.swagger ? '\nAPI documentation will be available at http://localhost:3000/api-docs' : ''}

## Available Scripts

- \`${data.packageManager} run dev\` - Start development server
- \`${data.packageManager} run build\` - Build for production
- \`${data.packageManager} start\` - Start production server${
    data.jest
      ? `
- \`${data.packageManager} test\` - Run tests
- \`${data.packageManager} test:watch\` - Run tests in watch mode`
      : ''
  }
- \`${data.packageManager} lint\` - Run ESLint
- \`${data.packageManager} format\` - Format code with Prettier

## Project Structure

\`\`\`
src/
├── app.ts           # Express app configuration
├── server.ts        # HTTP server setup & entry point
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middlewares/     # Express middlewares
├── routes/          # Route definitions
├── services/        # Business logic
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
\`\`\`

${
  data.docker
    ? `
## Docker

### Build and run with Docker Compose

\`\`\`bash
docker-compose up --build
\`\`\`

### Build Docker image

\`\`\`bash
docker build -t ${data.projectName} .
\`\`\`

### Run Docker container

\`\`\`bash
docker run -p 3000:3000 ${data.projectName}
\`\`\`
`
    : ''
}

## License

MIT
`;
}
