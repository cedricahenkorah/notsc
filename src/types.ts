export interface ProjectConfig {
  name: string;
  database: boolean;
  swagger: boolean;
  redis: boolean;
  jest: boolean;
  docker: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm';
  git: boolean;
}

export interface TemplateData {
  projectName: string;
  database: boolean;
  swagger: boolean;
  redis: boolean;
  jest: boolean;
  docker: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm';
}
