var _ = require('underscore');
var fs = require('fs');

// add globals default
exports.addGlobals = function(globalsList, globalFoldersList) {
  var i;
  var globals = {};
  var globalFilesList = [];
  // add all file names
  for (i = 0; i < globalFoldersList.length; i++) {
    globalFilesList = globalFilesList.concat(
      fs.readdirSync(globalFoldersList[i])
    );
  }
  // choose js file to add in globals
  for (i = 0; i < globalFilesList.length; i++) {
    var fileName = globalFilesList[i];
    var suffix = fileName.substring(fileName.length - 3, fileName.length);
    if (suffix === '.js' || suffix === '.JS') {
      globalsList.push(fileName.substring(0, fileName.length - 3));
    }
  }
  // keep each globals uniq
  globalsList = _.uniq(globalsList);

  for (i = 0; i < globalsList.length; i++) {
    globals[globalsList[i]] = true;
  }
  return globals;
};

exports.appendConfigFile = function(globals, sailsConfigFileName) {
  var eslintrcSails = {};
  fs.exists(sailsConfigFileName, function(exists) {
    if (exists) {
      var data = fs.readFileSync(sailsConfigFileName, 'utf-8');
      if (data) {
        eslintrcSails.globals = _.extend(globals, JSON.parse(data).globals);
        // return eslintrcSails.globals;
      } else {
        console.log('read ' + sailsConfigFileName + ' occurs error!');
        process.exit(0);
      }
    } else {
      console.log(sailsConfigFileName +
        ' is not exists, it will be created');
      fs.open(sailsConfigFileName, 'w', function(err) {
        if (err) {
          console.log('error:' + err);
          process.exit(0);
        }
        console.log(sailsConfigFileName + ' is created!');
      });
      eslintrcSails.globals = globals;
    }
    fs.writeFileSync(sailsConfigFileName,
      JSON.stringify(eslintrcSails, null, '\t'));
  });
};

exports.overrideConfigFile = function(globals, sailsConfigFileName) {
  var eslintrcSails = {};
  eslintrcSails.globals = globals;
  fs.exists(sailsConfigFileName, function(exists) {
    if (exists) {
      console.log(sailsConfigFileName + ' is overrided!');
    } else {
      fs.open(sailsConfigFileName, 'w', function(err) {
        if (err) {
          console.log('error:' + err);
          process.exit(0);
        } else {
          console.log(sailsConfigFileName + ' is created!');
        }
      });
    }
    fs.writeFileSync(sailsConfigFileName,
      JSON.stringify(eslintrcSails, null, '\t'));
  });
};
