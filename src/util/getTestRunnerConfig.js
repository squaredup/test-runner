'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTestRunnerConfig = void 0;
var path_1 = require('path');
var core_common_1 = require('@storybook/core-common');
var testRunnerConfig;
var loaded = false;
var getTestRunnerConfig = function (configDir) {
  // testRunnerConfig can be undefined
  if (loaded) {
    return testRunnerConfig;
  }
  testRunnerConfig = (0, core_common_1.serverRequire)(
    (0, path_1.join)((0, path_1.resolve)(configDir), 'test-runner')
  );
  loaded = true;
  return testRunnerConfig;
};
exports.getTestRunnerConfig = getTestRunnerConfig;
