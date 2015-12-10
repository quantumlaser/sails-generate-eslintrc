var fs = require('fs');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// var _ = require('underscore');
var globals = {};
var eslintrcSails = {};
var globalsList = ['sails'];
var prefixPath = './';
var globalFoldersList = ['api/controllers', 'api/models', 'api/services'];
var eslintConfigFileName = '.eslintrc';
var sailsConfigFileName = '.eslintrc-sails';

// add globals default
var i;
for (i = 0; i < globalsList.length; i++) {
  globals[globalsList[i]] = true;
}
// add all file names
for (i = 0; i < globalFoldersList.length; i++) {
  globalsList = globalsList.concat(
    fs.readdirSync(prefixPath + globalFoldersList[i])
  );
}
// choose globas names by .js
for (i = 0; i < globalsList.length; i++) {
  var fileName = globalsList[i];
  var suffix = fileName.substring(fileName.length - 3, fileName.length);
  if (suffix === '.js' || suffix === '.JS') {
    globals[fileName.substring(0, fileName.length - 3)] = true;
  }
}

// write globals to .eslintrc-sails
eslintrcSails.globals = globals;
fs.writeFileSync(sailsConfigFileName,
  JSON.stringify(eslintrcSails, null, '\t'));

// console.log(globals);

var updateGlobals = function(err, data) {
  if (err) {
    console.log('readFile return error:');
    console.log(err);
  } else {
    // console.log(data);
    var config = JSON.parse(data);
    // config.globals = _.extend(config.globals, globals);
    if (config.extends.indexOf(sailsConfigFileName) > 0) {
      console.log('add ' + sailsConfigFileName);
      return;
    }
    config.extends = config.extends.concat(sailsConfigFileName);
    // console.log(config);
    fs.writeFileSync(eslintConfigFileName, JSON.stringify(config, null, '\t'));
    console.log('add ' + sailsConfigFileName +
      ' and modify ' + eslintConfigFileName);
  }
};

var establishEslintrc = function(answer) {
  switch (answer.trim()) {
    case 'yes': case 'y': case 'Y':
      fs.open(eslintConfigFileName, 'w', function(err) {
        if (err) {
          console.log(err);
          process.exit(0);
        }
        // console.log(fd);
        console.log(eslintConfigFileName + ' and ' +
          sailsConfigFileName + ' are established');
        fs.writeFileSync(eslintConfigFileName,
          JSON.stringify({
            extends: ['google', sailsConfigFileName]
          }, null, '\t'));
      });
      rl.close();
      break;
    case 'no': case 'n': case 'N':
      console.log('Please establish ' + eslintConfigFileName + ' first!');
      rl.close();
      break;
    default:
      console.log('Please establish ' + eslintConfigFileName + ' first!');
      rl.close();
      break;
  }
};

var checkFileExists = function(exists) {
  if (exists) {
    fs.readFile(eslintConfigFileName, 'utf-8', updateGlobals);
    rl.close();
  } else {
    console.log(eslintConfigFileName + ' is not exists!');
    rl.question('Do you want to establish config file named ' +
      eslintConfigFileName +
      ' and set google as default coding style(yes/no):  ',
      establishEslintrc);
  }
};

fs.exists(eslintConfigFileName, checkFileExists);
// rl.close();
