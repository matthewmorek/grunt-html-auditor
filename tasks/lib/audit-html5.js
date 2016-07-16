/*
 * grunt-html-auditor
 * https://github.com/mmorek/grunt-html-auditor
 *
 * Copyright (c) 2016 Matthew Morek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (data, done) {
  // var htmlauditor = require('html-auditor');
  var chalk = require('chalk');
  var execFile = require('child_process').execFile;

  // custom forEach method
  var forEach = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]);
    }
  };

  // process raw output from stdout
  var processResult = function (stdout) {
    var lines = stdout.toString().trim().split('\n');
    var results = [];
    lines.forEach(function(line) {
      results.push(line);
    });
    return results;
  };

  var indent = '  ';

  if (!data.options.tests.html5) {
    done(null, data);
    return;
  }

  data.grunt.log.writeln('');
  data.grunt.log.writeln(chalk.yellow.bold('> Validating your HTML5 markup...'));
  data.grunt.log.writeln('');

  var bin = process.cwd() + '/node_modules/.bin/html-audit';
  execFile(bin, ['html5', '--path', data.file.file], function (error, result, code) {
    if (error) {
      data.logger(chalk.red(result));
      data.logger(chalk.red(code));
      data.grunt.fail.fatal(result, 1);
    }

    var rawData = processResult(result);
    var results = JSON.parse(rawData.pop())['html5'];

    if (Object.keys(results).length > 0) {
      var messages = results[data.file.file];
      if (Object.keys(messages).length > 0) {
        var count = {
          errors: 0,
          warnings: 0,
          notices: 0,
        };
        var total = messages.length;

        forEach(messages, function (index, item) {
          var i = index + 1;
          switch (item.type) {
            case 'error':
              data.grunt.log.writeln(indent + chalk.red.bold('Error: ') + item.message);
              count.errors++;
              break;
            case 'warning':
              data.grunt.log.writeln(indent + chalk.yellow.bold('Warning: ') + item.message);
              count.warnings++;
              break;
            case 'notice':
              data.grunt.log.writeln(indent + chalk.dim.bold('Notice: ') + item.message);
              count.notices++;
              break;
          }

          if (!data.options.summary) {
            data.grunt.log.writeln(indent + chalk.white.bold('Line: ') + item.lastLine);
            data.grunt.log.writeln(indent + chalk.white.bold('Extract: ') + chalk.cyan(item.extract));
          }

          data.grunt.log.writeln('');
        });

        data.grunt.log.write(indent + chalk.red('Errors: ' + count.errors + '; '));
        data.grunt.log.write(chalk.yellow('Warnings: ' + count.warnings + '; '));
        data.grunt.log.writeln(chalk.dim('Notices: ' + count.notices + '; '));
        data.grunt.log.writeln('');

        if (count.errors > 0) {
          data.grunt.log.error(chalk.red.bold('Your HTML5 markup contains some validation errors.'));
        }
      }
    } else {
      data.grunt.log.ok(chalk.green.bold('Your HTML5 markup appears 100% valid.'));
    }

    done(null, data);
  });
};
