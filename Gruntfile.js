/*
 * grunt-html-auditor
 * https://github.com/mmorek/grunt-html-auditor
 *
 * Copyright (c) 2016 Matthew Morek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    htmlaudit: {
      default_options: {
        options: {},
        src: 'test/fixtures/*.html'
      },
      custom_options: {
        options: {
          tests: {
            a11y: true,
            html5: true,
            link: true
          },
          baseUri: 'http://www.acme.com',
          showDetails: false,
          showNotices: false,
          showSummaryOnly: true,
          debug: false
        },
        src: 'test/fixtures/*.html'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'htmlaudit', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
