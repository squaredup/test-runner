"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTestRunnerConfig = void 0;
var _path = require("path");
var _coreCommon = require("@storybook/core-common");
let testRunnerConfig;
let loaded = false;
const getTestRunnerConfig = configDir => {
  // testRunnerConfig can be undefined
  if (loaded) {
    return testRunnerConfig;
  }
  testRunnerConfig = (0, _coreCommon.serverRequire)((0, _path.join)((0, _path.resolve)(configDir), 'test-runner'));
  loaded = true;
  return testRunnerConfig;
};
exports.getTestRunnerConfig = getTestRunnerConfig;