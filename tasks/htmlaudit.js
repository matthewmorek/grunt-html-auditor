/*
 * grunt-html-auditor
 * https://github.com/mmorek/grunt-html-auditor
 *
 * Copyright (c) 2016 Matthew Morek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var async = require('async');
  var path = require('path');
  var chalk = require('chalk');
  var logger;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('htmlaudit', 'Grunt plugin for node-html-auditor.', function() {
    var allDone = this.async();
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      tests: ['a11y', 'html5', 'link'],
      summary: true,
      debug: false
    });

    // Our custom logger that only logs when in debug mode
    logger = require('./lib/logger')(options.debug);

    var files = [];
    // Iterate over all specified file groups and collect valid files
    this.files.forEach(function (f) {
      var cwd = path.resolve(f.orig.cwd || '.');
      var src = f.src.filter(function (filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        }
        else {
          return true;
        }
      }).forEach(function (file) {
        var filename = path.basename(file);
        // Extract the subdir so we can prefix it when saving the various types (svg, png, etc) to the dest
        var subdir = path.dirname(path.relative(cwd, path.resolve(file)));

        files.push({
          file: file,
          filename: filename,
          src: file,
          destRoot: f.orig.dest,
          destSubdir: subdir
        });
      });
    }, this);

    // Process each source file
    async.eachSeries(files, function (file, fileDone) {
      async.waterfall([
        function init(done) {
          logger(chalk.yellow('Processing file: ' + file.filename));

          var data = {
            options: options,
            grunt: grunt,
            file: file,
            logger: logger
          };

          done(null, data);
        },
        require('./lib/audit-a11y'),
        require('./lib/audit-html5'),
        // require('./lib/audit-link'),
      ], function (err, data) {

        logger('Done with file: ' + data.file.filename);
        logger(chalk.yellow('-------------------'));

        fileDone(err);
      });
    },
    function (err) {
      if (err) {
        console.error(err);
        return allDone(false);
      } else {
        logger('');
        logger(chalk.green.bold('Done processing all HTML files.'));
        allDone();
      }
    });
  });
};
