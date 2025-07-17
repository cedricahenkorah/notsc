import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { TemplateData } from './types';

const templatesPath = path.join(__dirname, '../templates');
const env = nunjucks.configure(templatesPath, { autoescape: false });

export function getTemplates(data: TemplateData): Record<string, string> {
  const templates: Record<string, string> = {};

  const templateFiles = [
    'package.json',
    'tsconfig.json',
    'src/app.ts',
    'src/server.ts',
    'src/config/database.ts',
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
    '.gitignore',
    '.eslintrc.js',
    '.prettierrc',
    'nodemon.json',
    'README.md'
  ];

  if (data.jest) {
    templateFiles.push('jest.config.js', 'src/__tests__/health.test.ts');
  }

  if (data.docker) {
    templateFiles.push('Dockerfile', '.dockerignore', 'docker-compose.yml');
  }

  templateFiles.forEach(file => {
    const templatePath = file.replace(/\//g, path.sep);
    templates[file] = env.render(templatePath, data);
  });

  return templates;
}
