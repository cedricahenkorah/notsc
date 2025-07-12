import chalk from 'chalk';
import inquirer from 'inquirer';
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

  // Get project configuration
  const config = await getProjectConfig(projectName, options);

  // Create project directory
  const projectPath = path.resolve(process.cwd(), config.name);

  if (fs.existsSync(projectPath)) {
    const { overwrite } = await inquirer.prompt([
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
    // Create project directory
    fs.mkdirSync(projectPath, { recursive: true });

    // Generate project files
    await generateFiles(projectPath, config);

    // Install dependencies
    console.log(chalk.blue('\n📦 Installing dependencies...'));
    await installDependencies(projectPath, config.packageManager);

    // Initialize Git repository
    if (config.git) {
      console.log(chalk.blue('\n🔧 Initializing Git repository...'));
      await initializeGit(projectPath);
    }

    // Success message
    console.log(chalk.green('\n✅ Project created successfully!'));
    console.log(chalk.blue('\nNext steps:'));
    console.log(chalk.white(`  cd ${config.name}`));
    console.log(chalk.white('  npm run dev'));
    console.log(chalk.gray('\nYou’re all set. Have fun building! 🦉🎉'));
  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
    throw error;
  }
}

async function getProjectConfig(
  projectName?: string,
  options: { git?: boolean; help?: boolean } = {}
): Promise<ProjectConfig> {
  const answers = await inquirer.prompt([
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
      message: 'Would you like to include database (MongoDB) setup?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'swagger',
      message: 'Would you like to include Swagger/OpenAPI documentation?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'redis',
      message: 'Would you like to set up Redis (for caching, sessions, etc.)?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'jest',
      message: 'Would you like to include Jest for unit testing?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'docker',
      message: 'Would you like to include Docker setup for containerization?',
      default: false,
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
    swagger: answers.swagger,
    redis: answers.redis,
    jest: answers.jest,
    docker: answers.docker,
    packageManager: answers.packageManager,
    git: options.git !== false,
  };
}

async function installDependencies(
  projectPath: string,
  packageManager: 'npm' | 'yarn' | 'pnpm'
): Promise<void> {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install',
  };

  try {
    execSync(commands[packageManager], {
      cwd: projectPath,
      stdio: 'inherit',
    });
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
    execSync('git add .', { cwd: projectPath, stdio: 'inherit' });
    execSync('git commit -m "Initial commit"', {
      cwd: projectPath,
      stdio: 'inherit',
    });
  } catch (error) {
    console.warn(chalk.yellow('Warning: Failed to initialize Git repository.'));
    console.warn(chalk.gray('Please initialize Git manually if needed.'));
  }
}
