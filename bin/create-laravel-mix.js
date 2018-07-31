#!/usr/bin/env node
'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const commander = require('commander');
const chalk = require('chalk');

let preset;

commander
  .version(require('../package').version)
  .arguments('<preset>')
  .usage(`${chalk.green('preset(vue|react)')}`)
  .action(name => {
    preset = name;
  })
  .parse(process.argv);

if (typeof preset === 'undefined' || !['vue', 'react'].includes(preset)) {
  console.error('Please specify the preset');
  console.log();
  console.log(
    `For example: ${chalk.cyan(commander.name())} ${chalk.green('react')}`
  );
  console.log();
  console.log(
    `Run ${chalk.cyan(`${commander.name()} --help`)} to see all options.`
  );
  process.exit(1);
}

const templateDir = path.join(__dirname, '..', 'templates');
const packageJson = _.merge(
  require(path.join(templateDir, '_base', 'package.json')),
  require(path.join(templateDir, preset, 'package.json'))
);
const cwd = process.cwd();

fs.writeFileSync(
  path.resolve(cwd, 'package.json'),
  JSON.stringify(packageJson, null, 2) + os.EOL
);

fs.copySync(
  path.join(templateDir, '_base', 'assets'),
  path.resolve(cwd, 'assets')
);

fs.copySync(
  path.join(templateDir, preset, 'webpack.mix.js'),
  path.resolve(cwd, 'webpack.mix.js')
);

fs.copySync(
  path.join(templateDir, preset, 'js'),
  path.resolve(cwd, 'assets', 'js')
);

console.log();
console.log(
  `Creating a new ${preset} app in ${chalk.green(path.resolve(cwd))}.`
);
console.log();
console.log('You begin by typing:');
console.log();
console.log(`  ${chalk.cyan('npm install')}`);
console.log('  or');
console.log(`  ${chalk.cyan('yarn')}`);
