import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { TemplateData } from './types';
import { generateGitignore } from './generate-gitignore';

const templatesPath = path.join(__dirname, '../templates');
const env = nunjucks.configure(templatesPath, { autoescape: false });

export function getTemplates(data: TemplateData): Record<string, string> {
  const templates: Record<string, string> = {};

  const templateFiles = [
    'package.json',
    'tsconfig.json',
    'src/app.ts',
    'src/server.ts',
    'src/config/redis.ts',
    'src/controllers/healthController.ts',
    'src/routes/healthRoutes.ts',
    'src/routes/index.ts',
    'src/middlewares/errorHandler.ts',
    'src/middlewares/requestLogger.ts',
    'src/services/healthService.ts',
    'src/types/index.ts',
    'src/utils/logger.ts',
    'src/utils/api-response.ts',
    '.env.example',
    'README.md',
  ];

  if (data.jest) {
    templateFiles.push('jest.config.js', 'src/__tests__/health.test.ts');
  }

  if (data.docker) {
    templateFiles.push('Dockerfile', '.dockerignore', 'docker-compose.yml');
  }

  if (data.database && data.databaseType === `MongoDB`) {
    templateFiles.push('src/config/database.ts');
  }

  if (data.database && data.databaseType === `PostgreSQL (Prisma ORM)`) {
    templateFiles.push(
      'src/config/database-prisma.ts',
      'prisma/schema.prisma',
      'prisma/seed.ts'
    );
  }

  templateFiles.forEach(file => {
    const templatePath = file.replace(/\//g, path.sep);
    // Handle conditional database config file naming
    let outputFile = file;
    if (file === 'src/config/database-prisma.ts') {
      outputFile = 'src/config/database.ts';
    }
    templates[outputFile] = env.render(templatePath, data);
  });

  templates['.gitignore'] = generateGitignore();

  return templates;
}
