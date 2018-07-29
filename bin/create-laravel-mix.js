#!/usr/bin/env node
'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const templateDir = path.join(__dirname, 'templates');
const basePackageJson = require(path.join(templateDir, '_base', 'package.json'));

const preset = process.argv[2];

if (preset === 'react') {
    createPackageJson(_.merge(basePackageJson, require(path.join(templateDir, 'react', 'package.json'))));
    fs.copySync(path.join(__dirname, './templates/_base/assets'), path.resolve('./assets'));
    copyTemplate(preset)
}

if (preset === 'vue') {
    createPackageJson(_.merge(basePackageJson, require(path.join(templateDir, 'vue', 'package.json'))));
    fs.copySync(path.join(templateDir, '_base', 'assets'), path.resolve('./assets'));
    copyTemplate(preset)
}

function createPackageJson(packageJson) {
    fs.writeFileSync(
        path.resolve('package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL
    );
}

function copyTemplate(preset) {
    fs.copySync(
        path.join(templateDir, preset, 'webpack.mix.js'),
        path.resolve('./webpack.mix.js')
    );

    fs.copySync(
        path.join(templateDir, preset, 'js'),
        path.resolve('./assets/js'));
}