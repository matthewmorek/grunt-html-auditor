/**
 * grunt-html-auditor
 * https://github.com/matthewmorek/grunt-html-auditor
 *
 * Copyright (c) 2016 Matthew Morek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (debug) {
  var logger = function(msg) {
    if (debug) {
      console.log('Debug: ' + msg);
    }
  };

  return logger;
};
