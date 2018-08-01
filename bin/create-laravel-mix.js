#!/usr/bin/env node
'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const commander = require('commander');
const chalk = require('chalk');
const replace = require('replace-in-file');

let preset;

commander
  .version(require('../package').version)
  .usage(`${chalk.green('<preset>(vue|react)')} [options]`)
  .arguments('<preset>')
  .option('--assets-dir <path>', '(default: assets)')
  .option('--public-dir <path>', '(default: public)')
  .action((name, options) => {
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
const assetsDir = commander.assetsDir || 'assets';
const publicDir = commander.publicDir || 'public';

fs.writeFileSync(
  path.resolve(cwd, 'package.json'),
  JSON.stringify(packageJson, null, 2) + os.EOL
);

fs.copySync(
  path.join(templateDir, '_base', 'assets'),
  path.resolve(cwd, assetsDir)
);

fs.copySync(
    path.join(templateDir, preset, 'js'),
    path.resolve(cwd, assetsDir, 'js')
);

fs.copySync(
  path.join(templateDir, preset, 'webpack.mix.js'),
  path.resolve(cwd, 'webpack.mix.js')
);

replace.sync({
  files: path.resolve(cwd, 'webpack.mix.js'),
  from: [/##assets##/g, /##public##/g],
  to: [assetsDir, publicDir]
});

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
