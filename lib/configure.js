var fs = require('fs');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var eslintConfigFileName;
var sailsConfigFileName;
// preset code style
var preset;
var updateEslintrc = function(err, data) {
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
            extends: [preset, sailsConfigFileName]
          }, null, '\t'));
      });
      break;
    case 'no': case 'n': case 'N':
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
      fs.readFile(eslintConfigFileName, 'utf-8', updateEslintrc);
      rl.close();
    } else {
      console.log(eslintConfigFileName + ' is not exists!');
      rl.question('Do you want to establish config file named ' +
        eslintConfigFileName +
        ' and set ' + presetCodeStyle + ' as default coding style(yes/no):  ',
        establishEslintrc);
    }
  });
};
