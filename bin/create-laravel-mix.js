#!/usr/bin/env node
'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const templateDir = path.join(__dirname, '..', 'templates');
const basePackageJson = require(path.join(templateDir, '_base', 'package.json'));

const preset = process.argv[2];

if (!['vue', 'react'].includes(preset)) {
    return;
}

const packageJson = _.merge(basePackageJson, require(path.join(templateDir, preset, 'package.json')));
fs.writeFileSync(
    path.resolve('package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
);

fs.copySync(path.join(templateDir, '_base', 'assets'), path.resolve('./assets'));

fs.copySync(
    path.join(templateDir, preset, 'webpack.mix.js'),
    path.resolve('./webpack.mix.js')
);

fs.copySync(
    path.join(templateDir, preset, 'js'),
    path.resolve('./assets/js')
);
