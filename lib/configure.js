var fs = require('fs');
var path = require('path');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var eslintConfigFileName;
var sailsConfigFileName;
// preset code style
var preset = null;

var readFile = function(fileName, cb) {
  console.log('./' + fileName)
  switch (path.extname(fileName)) {
    case '':
      try {
        var config = JSON.parse(fs.readFileSync(fileName, 'utf-8'));
        cb(null, config);
      } catch (err) {
        cb(err);
      }
      break;
    case '.js':
    case '.json':
      try {
        var eslintConfig = require('/' + process.cwd() + '/' + fileName);
        cb(null, eslintConfig);
      } catch (err) {
        console.trace(err);
        cb(err);
      }
      break;
    default:
      console.error('readFile: Can\'t found the eslintrc file.');
  }
};

var writeFile = function(fileName, data) {
  switch (path.extname(fileName)) {
    case '':
    case '.json':
      fs.writeFileSync(eslintConfigFileName, data);
      break;
    case '.js':
      fs.writeFileSync(eslintConfigFileName, 'module.exports = ' + data);
      break;
    default:
      console.error('writeFile: Can\'t found the eslintrc file.');
  }
};

var updateEslintrc = function(err, config) {
  if (err) {
    console.log('readFile return error:');
    console.log(err);
  } else {
    // console.log(data);
    // config.globals = _.extend(config.globals, globals);
    if (config.extends.indexOf(sailsConfigFileName) >= 0) {
      console.log('add ' + sailsConfigFileName);
      return;
    }

    // If config.extends is not Array, change it to Array.
    if (!Array.isArray(config.extends))
      config.extends = [config.extends];

    if (preset && config.extends.indexOf(preset) < 0) {
      config.extends = config.extends.concat(preset);
    }
    config.extends = config.extends.concat(sailsConfigFileName);
    // console.log(config);
    writeFile(eslintConfigFileName, JSON.stringify(config, null, '\t'));
    console.log('add ' + sailsConfigFileName +
      ' and modify ' + eslintConfigFileName);
  }
};

var establishEslintrc = function(answer) {
  switch (answer.trim()) {
    case 'yes':
    case 'y':
    case 'Y':
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
            extends: [preset, sailsConfigFileName]
          }, null, '\t'));
      });
      break;
    case 'no':
    case 'n':
    case 'N':
      console.log('Please establish ' + eslintConfigFileName + ' first!');
      break;
    default:
      console.log('Please establish ' + eslintConfigFileName + ' first!');
      break;
  }
  rl.close();
};

exports.configureEslintrc = function(eFileName, sFileName, presetCodeStyle) {
  eslintConfigFileName = eFileName;
  sailsConfigFileName = sFileName;
  preset = presetCodeStyle;
  fs.exists(eslintConfigFileName, function(exists) {
    if (exists) {
      readFile(eslintConfigFileName, updateEslintrc);
      rl.close();
    } else {
      console.log(eslintConfigFileName + ' is not exists!');
      preset = preset ? preset : 'google';
      rl.question('Do you want to establish config file named ' +
        eslintConfigFileName +
        ' and set ' + preset + ' as default coding style(yes/no):  ',
        establishEslintrc);
    }
  });
};
