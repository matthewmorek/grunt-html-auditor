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

  if (!data.options.tests.link) {
    done(null, data);
    return;
  }

  data.grunt.log.writeln('');
  data.grunt.log.writeln(chalk.yellow.bold('> Validating links...'));
  data.grunt.log.writeln(chalk.dim(indent + 'Base URL: ' + data.options.baseUri));
  if (!data.options.showSummaryOnly) {
    data.grunt.log.writeln('');
  }

  var bin = process.cwd() + '/node_modules/.bin/html-audit';
  execFile(bin, ['link', '--path', data.file.file, '--base-uri', data.options.baseUri], function (error, result, code) {
    data.logger(chalk.yellow(bin + ' link ' + '--path ' + data.file.file + ' --base-uri ' + data.options.baseUri));

    if (error) {
      data.grunt.log.writeln(chalk.red(result));
      data.grunt.log.writeln(chalk.red(code));
      data.grunt.fail.fatal(result, 1);
    }

    var rawData = processResult(result);
    var results = JSON.parse(rawData.pop())['link'];
    data.logger(chalk.yellow(JSON.stringify(results)));

    if (Object.keys(results).length > 0) {
      var messages = results[data.file.file];
      if (Object.keys(messages).length > 0) {
        var count = {
          errors: 0
        };

        var total = messages.length;

        forEach(messages, function (index, item) {
          var i = index + 1;
          if (!data.options.showSummaryOnly) {
            data.grunt.log.writeln(indent + chalk.red.bold(item.error));
            data.grunt.log.writeln(indent + chalk.white.bold('Extract: ') + chalk.cyan(item.html));
            data.grunt.log.writeln(indent + chalk.white.bold('URL: ') + chalk.cyan(item.url.original));
            data.grunt.log.writeln(indent + chalk.white.bold('Resolved: ') + chalk.cyan(item.url.resolved));
            data.grunt.log.writeln(indent + chalk.white.bold('Redirected: ') + chalk.cyan(item.url.redirected));
            data.grunt.log.writeln('');
          }
          count.errors++;
        });

        data.grunt.log.writeln(indent + chalk.red('Errors: ' + count.errors + '; '));
        data.grunt.log.writeln('');

        if (count.errors > 0) {
          data.grunt.log.error(chalk.red.bold('Markup contains ' + count.errors + ' invalid URL(s).'));
        }
      }
    } else {
      data.grunt.log.writeln('');
      data.grunt.log.ok(chalk.green.bold('Links appear to be 100% valid.'));
    }

    done(null, data);
  });
};
