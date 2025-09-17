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

// Initialize update notifier
const notifier = updateNotifier({
  pkg: packageJson,
  updateCheckInterval: 1000 * 60 * 60 * 24, // Check once per day
});

// Show update notification with custom styling
notifier.notify({
  defer: false,
  message: [
    '',
    chalk.bgYellow.black(' UPDATE AVAILABLE '),
    '',
    `Current: ${chalk.red('{currentVersion}')}`,
    `Latest:  ${chalk.green('{latestVersion}')}`,
    '',
    `Run ${chalk.cyan('npm install -g notsc')} to update`,
    '',
  ].join('\n'),
  isGlobal: true,
  boxenOptions: {
    padding: 1,
    margin: 1,
    align: 'center',
    borderColor: 'yellow',
    borderStyle: 'round',
  },
});

const program = new Command();

program
  .name('notsc')
  .description(
    'Notsc is a highly customizable boilerplate generator for quickly scaffolding Node.js + TypeScript API projects'
  )
  .version(packageJson.version)
  .argument('[project-name]', 'Name of the project to create')
  .option('--no-git', 'Skip Git initialization')
  .option('--check-updates', 'Force check for updates')
  .action(
    async (
      projectName: string,
      options: { git?: boolean; checkUpdates?: boolean }
    ) => {
      try {
        // Handle manual update check
        if (options.checkUpdates) {
          console.log(chalk.blue('🔍 Checking for updates...'));

          // Force fresh check by creating new notifier with 0 interval
          const freshNotifier = updateNotifier({
            pkg: packageJson,
            updateCheckInterval: 0,
          });

          // Give it a moment to check
          await new Promise(resolve => setTimeout(resolve, 1000));

          if (freshNotifier.update) {
            console.log(chalk.yellow('\n📦 Update available!'));
            console.log(chalk.gray(`Current: ${freshNotifier.update.current}`));
            console.log(chalk.green(`Latest:  ${freshNotifier.update.latest}`));
            console.log(
              chalk.blue(
                `\nRun ${chalk.white('npm install -g notsc')} to update\n`
              )
            );
          } else {
            console.log(chalk.green('✅ You are using the latest version!'));
          }
          return;
        }

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
