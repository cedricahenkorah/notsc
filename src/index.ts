#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from './generator';
import { readFileSync } from 'fs';
import { join } from 'path';
import updateNotifier from 'update-notifier';

const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

const notifier = updateNotifier({ pkg: packageJson });

notifier.notify();

const program = new Command();

program
  .name('notsc')
  .description(
    'Notsc is a highly customizable boilerplate generator for quickly scaffolding Node.js + TypeScript API projects'
  )
  .version(packageJson.version)
  .argument('[project-name]', 'Name of the project to create')
  .option('--no-git', 'Skip Git initialization')
  .action(async (projectName: string, options: { git?: boolean }) => {
    try {
      await createProject(projectName, options);
    } catch (error) {
      console.error(
        chalk.red('Error:'),
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
      process.exit(1);
    }
  });

program.parse();
