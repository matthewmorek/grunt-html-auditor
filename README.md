# grunt-html-auditor

> Grunt plugin for [node-html-auditor](github.com/wfp/node-html-auditor).

[![npm](https://img.shields.io/npm/v/grunt-html-auditor.svg?maxAge=2592000?style=flat-square)](https://github.com/matthewmorek/grunt-html-auditor/releases/tag/v1.0.0)
[![Travis branch](https://img.shields.io/travis/matthewmorek/grunt-html-auditor/v1.0.0.svg?maxAge=2592000?style=flat-square)](github.com/matthewmorek/grunt-html-auditor)

## Getting Started
This plugin requires Grunt `~1.0.1`

Install this plugin with this command:
```shell
npm install grunt-html-auditor --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:
```js
grunt.loadNpmTasks('grunt-html-auditor');
```

## The "htmlaudit" task

### Overview
In your project's Gruntfile, add a section named `htmlaudit` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  htmlaudit: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.tests
Type: `Object`
Default value:
```
{
  a11y: true,
  html5: true,
  link: true
}
```

An Object that is used to toggle which tests should be run upon execution.

#### options.baseUri
Type: `String`
Default value: `'http://www.acme.com''`

A URL that is used to serve as a basis for testing links.

#### options.showDetails
Type: `Boolean`
Default value: `true`

If set to `false`, the plugin will only display a summary of all `a11y` and `html5` issues, and not full debug info.

#### options.showNotices
Type: `Boolean`
Default value: `true`

If set to `false`, the plugin will only display `error` and `warning` issue, but not `notice` or `info`.

#### options.debug
Type: `Boolean`
Default value: `false`

If set to `true`, the plugin will display additional plugin-related debug information.

### Usage Examples

#### Default Options
In this example, the default options are used to run all available tests (`a11y`, `html5`, `link`). The plugin does not make any alterations to your files, it simply reads their contents and runs all tests using `node-html-auditor` binary.

```js
grunt.initConfig({
  htmlaudit: {
    options: {},
    src: 'path/to/your/file(s)/*.html'
  },
});
```

#### Custom Options
In this example, custom options are used to run **only** accessibility tests, on a single HTML file. As with using default options, the plugin will never alter any of your files.

```js
grunt.initConfig({
  htmlaudit: {
    options: {
      tests: {
        a11y: true,
        html5: false,
        link: false
      }
    },
    src: 'path/to/your/file.html',
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
