#!/usr/bin/env node

/**
 * Module dependencies.
 */
var generate = require('./lib/generate');
var configure = require('./lib/configure');
var _ = require('underscore');
var program = require('commander');

function list(val) {
  return val.split(',');
}

program
  .version('1.3.2')
  .option('-m, --mode <string>',
    'Set mode for .eslintrc-sails: append, override.' +
      'Default: Add default globals')
  .option('-g, --globals <items>',
    'Input globals list, like: sails, mysql', list)
  .option('-f, --folders <items>',
    'Input global folders list, like: api/controllers, config', list)
  .option('-c, --config <path>', 'Set eslint config file name')
  .option('-p, --preset <string>', 'Set preset coding style, like: google')
  .option('-s, --show [value]', 'Show globals added')
  .parse(process.argv);

// var _ = require('underscore');
var globals = {};
// var eslintrcSails = {};
var globalsList = ['sails'];
// var prefixPath = './';
var globalFoldersList = ['api/controllers', 'api/models', 'api/services'];
var eslintConfigFileName = '.eslintrc';
var sailsConfigFileName = '.eslintrc-sails';
var preset = null;

if (program.config) {
  eslintConfigFileName = program.config;
}
if (program.preset) {
  preset = program.preset;
}

if (program.mode) {
  switch (program.mode.trim()) {
    case 'append': case 'a':
      globalsList = program.globals ? program.globals : [];
      globalFoldersList = program.folders ? program.folders : [];
      globals = generate.addGlobals(globalsList, globalFoldersList);
      generate.appendConfigFile(globals, sailsConfigFileName);
      break;
    case 'override': case 'o':
      globalsList = program.globals ? program.globals : [];
      globalFoldersList = program.folders ? program.folders : [];
      globals = generate.addGlobals(globalsList, globalFoldersList);
      generate.overrideConfigFile(globals, sailsConfigFileName);
      break;
    default:
      globalsList = program.globals ?
        _.uniq(globalsList.concat(program.globals)) : globalsList;
      globalFoldersList = program.folders ?
        _.uniq(globalFoldersList.concat(program.folders)) : globalFoldersList;
      globals = generate.addGlobals(globalsList, globalFoldersList);
      generate.appendConfigFile(globals, sailsConfigFileName);

  }
} else {
  globalsList = program.globals ?
    _.uniq(globalsList.concat(program.globals)) : globalsList;
  globalFoldersList = program.folders ?
    _.uniq(globalFoldersList.concat(program.folders)) : globalFoldersList;
  globals = generate.addGlobals(globalsList, globalFoldersList);
  generate.appendConfigFile(globals, sailsConfigFileName);
}

if (program.show) {
  console.log('Added globals: ' + globals);
}

configure.configureEslintrc(eslintConfigFileName, sailsConfigFileName, preset);
