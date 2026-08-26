import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { ProjectConfig } from './types';
import { generateFiles } from './fileGenerator';

export async function createProject(
  projectName?: string,
  options: { git?: boolean; help?: boolean } = {}
) {
  console.log(chalk.blue('🦉 Welcome to notsc!'));
  console.log(
    chalk.gray(
      "Let's get your Node.js + TypeScript API project up and running.\n"
    )
  );

  const config = await getProjectConfig(projectName, options);

  const projectPath = path.resolve(process.cwd(), config.name);

  if (fs.existsSync(projectPath)) {
    const inquirer = await import('inquirer');
    const { overwrite } = await inquirer.default.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `Directory ${chalk.yellow(config.name)} already exists. Overwrite it?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow('Project creation cancelled.'));
      return;
    }

    fs.removeSync(projectPath);
  }

  console.log(chalk.blue(`\n📁 Creating project: ${config.name}`));

  try {
    fs.mkdirSync(projectPath, { recursive: true });

    console.log(chalk.blue('\n📝 Initializing package.json...'));
    initPackageJson(projectPath, config);

    await generateFiles(projectPath, config);

    patchPackageJson(projectPath, config);

    console.log(chalk.blue('\n📦 Installing dependencies...'));
    await installDependencies(projectPath, config);

    if (config.git) {
      console.log(chalk.blue('\n🔧 Initializing Git repository...'));
      await initializeGit(projectPath);
    }

    console.log(chalk.green('\n✅ Project created successfully!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log(chalk.white(`  cd ${config.name}`));
    console.log(chalk.white('  npm run dev'));
    console.log(chalk.gray("\nYou're all set. Have fun building! 🦉🎉"));
  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
    throw error;
  }
}

async function getProjectConfig(
  projectName?: string,
  options: { git?: boolean; help?: boolean } = {}
): Promise<ProjectConfig> {
  const inquirer = await import('inquirer');
  const answers = await inquirer.default.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What should we call your project?',
      default: projectName || 'my-node-ts-api',
      validate: (input: string) => {
        if (!input.trim()) return 'Please enter a project name.';
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Use only lowercase letters, numbers, and hyphens (e.g., my-api-project)';
        }
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'database',
      message: 'Would you like to include database setup?',
      default: true,
    },
    {
      type: 'list',
      name: 'databaseType',
      message: 'Select a database:',
      choices: ['MongoDB', 'PostgreSQL (Prisma ORM)'],
      when: answers => answers.database,
      default: 'MongoDB',
    },
    {
      type: 'confirm',
      name: 'swagger',
      message: 'Would you like to include Swagger/OpenAPI documentation?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'redis',
      message: 'Would you like to set up Redis (for caching, sessions, etc.)?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'jest',
      message: 'Would you like to include Jest for unit testing?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'docker',
      message: 'Would you like to include Docker setup for containerization?',
      default: true,
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Select a package manager:',
      choices: ['npm', 'yarn', 'pnpm'],
      default: 'npm',
    },
  ]);

  return {
    name: answers.name,
    database: answers.database,
    databaseType: answers.databaseType || null,
    swagger: answers.swagger,
    redis: answers.redis,
    jest: answers.jest,
    docker: answers.docker,
    packageManager: answers.packageManager,
    git: options.git !== false,
  };
}

function initPackageJson(projectPath: string, config: ProjectConfig): void {
  const initCmd =
    config.packageManager === 'yarn'
      ? 'yarn init -y'
      : config.packageManager === 'pnpm'
        ? 'pnpm init'
        : 'npm init -y';

  try {
    execSync(initCmd, { cwd: projectPath, stdio: 'inherit' });
  } catch (error) {
    console.warn(
      chalk.yellow(
        `Warning: Failed to run "${initCmd}". Falling back to writing a minimal package.json.`
      )
    );
    fs.writeJSONSync(
      path.join(projectPath, 'package.json'),
      { name: config.name, version: '1.0.0' },
      { spaces: 2 }
    );
  }
}

function patchPackageJson(projectPath: string, config: ProjectConfig): void {
  const pkgPath = path.join(projectPath, 'package.json');
  const pkg = fs.readJSONSync(pkgPath);

  pkg.name = config.name;
  pkg.version = '1.0.0';
  pkg.description = 'A Node.js TypeScript API';
  pkg.main = 'dist/server.js';
  pkg.keywords = ['nodejs', 'typescript', 'api', 'express'];
  pkg.author = pkg.author || '';
  pkg.license = pkg.license || 'MIT';

  const scripts: Record<string, string> = {
    start: 'node dist/server.js',
    dev: 'nodemon --exec ts-node src/server.ts',
    build: 'tsc',
    lint: 'eslint src/**/*.ts',
    format: 'prettier --write src/**/*.ts',
  };

  if (config.jest) {
    scripts.test = 'jest';
    scripts['test:watch'] = 'jest --watch';
  }

  if (config.database && config.databaseType === 'PostgreSQL (Prisma ORM)') {
    scripts['db:generate'] = 'prisma generate';
    scripts['db:push'] = 'prisma db push';
    scripts['db:migrate'] = 'prisma migrate dev';
    scripts['db:studio'] = 'prisma studio';
    scripts['db:seed'] = 'ts-node prisma/seed.ts';
  }

  pkg.scripts = scripts;

  fs.writeJSONSync(pkgPath, pkg, { spaces: 2 });
}

function resolveDependencies(config: ProjectConfig): {
  prod: string[];
  dev: string[];
} {
  const prod = [
    'express',
    'cors',
    'helmet',
    'dotenv',
    'winston',
    'winston-daily-rotate-file',
  ];
  const dev = [
    '@types/express',
    '@types/cors',
    '@types/node',
    'typescript',
    'ts-node',
    'nodemon',
  ];

  if (config.database && config.databaseType === 'MongoDB') {
    prod.push('mongoose');
  }
  if (config.database && config.databaseType === 'PostgreSQL (Prisma ORM)') {
    prod.push('@prisma/client');
    dev.push('prisma');
  }
  if (config.swagger) {
    prod.push('swagger-jsdoc', 'swagger-ui-express');
    dev.push('@types/swagger-jsdoc', '@types/swagger-ui-express');
  }
  if (config.redis) {
    prod.push('ioredis');
  }
  if (config.jest) {
    dev.push('jest', 'ts-jest', '@types/jest', 'supertest', '@types/supertest');
  }

  return { prod, dev };
}

async function installDependencies(
  projectPath: string,
  config: ProjectConfig
): Promise<void> {
  const { prod, dev } = resolveDependencies(config);

  const addCmd =
    config.packageManager === 'yarn'
      ? 'yarn add'
      : config.packageManager === 'pnpm'
        ? 'pnpm add'
        : 'npm install';
  const addDevFlag = config.packageManager === 'npm' ? '-D' : '-D';

  const run = (label: string, cmd: string) => {
    console.log(chalk.gray(`  → ${label}`));
    execSync(cmd, { cwd: projectPath, stdio: 'inherit' });
  };

  try {
    if (prod.length > 0) {
      run('installing dependencies', `${addCmd} ${prod.join(' ')}`);
    }
    if (dev.length > 0) {
      run(
        'installing devDependencies',
        `${addCmd} ${addDevFlag} ${dev.join(' ')}`
      );
    }
  } catch (error) {
    console.warn(
      chalk.yellow('Warning: Failed to install dependencies automatically.')
    );
    console.warn(
      chalk.gray(
        'Please run the install command manually in the project directory.'
      )
    );
  }
}

async function initializeGit(projectPath: string): Promise<void> {
  try {
    execSync('git init', { cwd: projectPath, stdio: 'inherit' });
  } catch (error) {
    console.warn(chalk.yellow('Warning: Failed to initialize Git repository.'));
    console.warn(chalk.gray('Please initialize Git manually if needed.'));
  }
}
