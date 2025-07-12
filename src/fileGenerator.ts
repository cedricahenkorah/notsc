import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { ProjectConfig, TemplateData } from './types';
import { getTemplates } from './templates';

export async function generateFiles(projectPath: string, config: ProjectConfig): Promise<void> {
  const templateData: TemplateData = {
    projectName: config.name,
    database: config.database,
    swagger: config.swagger,
    redis: config.redis,
    jest: config.jest,
    docker: config.docker,
    packageManager: config.packageManager
  };

  const templates = getTemplates(templateData);

  // Create all files
  for (const [filePath, content] of Object.entries(templates)) {
    const fullPath = path.join(projectPath, filePath);
    const dir = path.dirname(fullPath);
    
    // Ensure directory exists
    await fs.ensureDir(dir);
    
    // Write file
    await fs.writeFile(fullPath, content);
  }

  console.log(chalk.green('✅ Project files generated successfully!'));
} 