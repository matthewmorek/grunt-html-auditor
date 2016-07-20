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

  if (!data.options.tests.a11y) {
    done(null, data);
    return;
  }

  data.grunt.log.writeln(chalk.dim('------------'));
  data.grunt.log.writeln(chalk.yellow.bold('> Checking page against WCAG2 guidelines...'));
  if (!data.options.showSummaryOnly) {
    data.grunt.log.writeln('');
  }

  var bin = process.cwd() + '/node_modules/.bin/html-audit';
  execFile(bin, ['a11y', '--path', data.file.src], function (error, result, code) {
    if (error) {
      data.grunt.log.writeln('Running:' + bin + ' a11y --path ' + data.file.src);
      data.grunt.log.writeln(chalk.red(error));
      data.grunt.log.writeln(chalk.red(result));
      data.grunt.log.writeln(chalk.red(code));
      data.grunt.fail.fatal(result, 1);
    }

    var rawData = processResult(result);
    var results = JSON.parse(rawData.pop())['assessibility'];
    data.logger(chalk.yellow(JSON.stringify(results)));

    if (Object.keys(results).length > 0) {
      var messages = results[data.file.src];
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
              if (!data.options.showSummaryOnly) {
                data.grunt.log.writeln(indent + chalk.red.bold('Error: ') + item.message);
                if (data.options.showDetails) {
                  data.grunt.log.writeln(indent + chalk.white.bold('Code: ') + item.code);
                  data.grunt.log.writeln(indent + chalk.white.bold('Context: ') + chalk.cyan(item.context));
                  data.grunt.log.writeln(indent + chalk.white.bold('Selector: ') + chalk.blue(item.selector));
                }
                data.grunt.log.writeln('');
              }
              count.errors++;
              break;
            case 'warning':
              if (!data.options.showSummaryOnly) {
                data.grunt.log.writeln(indent + chalk.yellow.bold('Warning: ') + item.message);
                if (data.options.showDetails) {
                  data.grunt.log.writeln(indent + chalk.white.bold('Code: ') + item.code);
                  data.grunt.log.writeln(indent + chalk.white.bold('Context: ') + chalk.cyan(item.context));
                  data.grunt.log.writeln(indent + chalk.white.bold('Selector: ') + chalk.blue(item.selector));
                }
                data.grunt.log.writeln('');
              }
              count.warnings++;
              break;
            case 'notice':
              if (!data.options.showSummaryOnly && data.options.showNotices) {
                data.grunt.log.writeln(indent + chalk.dim.bold('Notice: ') + item.message);
                if (data.options.showDetails) {
                  data.grunt.log.writeln(indent + chalk.white.bold('Code: ') + item.code);
                  data.grunt.log.writeln(indent + chalk.white.bold('Context: ') + chalk.cyan(item.context));
                  data.grunt.log.writeln(indent + chalk.white.bold('Selector: ') + chalk.blue(item.selector));
                }
                data.grunt.log.writeln('');
              }
              count.notices++;
              break;
          }
        });

        data.grunt.log.write(indent + chalk.red('Errors: ' + count.errors + '; '));
        data.grunt.log.write(chalk.yellow('Warnings: ' + count.warnings + '; '));
        data.grunt.log.writeln(chalk.dim('Notices: ' + count.notices + '; '));
        data.grunt.log.writeln('');

        if (count.errors > 0) {
          data.grunt.log.error(chalk.red.bold('Page conains ' + count.errors + ' major accessibility issue(s).'));
        }
      }
    } else {
      data.grunt.log.ok(chalk.green.bold('Page appears to have no accessibility issues.'));
    }

    done(null, data);
  });
};
