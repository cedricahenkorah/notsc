#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from './generator';

const program = new Command();

program
  .name('notsc')
  .description(
    'A highly configurable boilerplate generator to kickstart a Node.js + TypeScript API project with ease'
  )
  .version('1.0.0')
  .argument('[project-name]', 'Name of the project to create')
  .option('--no-git', 'Skip Git initialization')
  .action(
    async (projectName: string, options: { git?: boolean }) => {
      try {
        await createProject(projectName, options);
      } catch (error) {
        console.error(
          chalk.red('Error:'),
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
        process.exit(1);
      }
    }
  );

program.parse();
