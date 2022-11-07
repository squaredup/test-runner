'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getStorybookMetadata = void 0;
var path_1 = require('path');
var core_common_1 = require('@storybook/core-common');
var getStorybookMain_1 = require('./getStorybookMain');
var getStorybookMetadata = function () {
  var _a, _b, _c;
  var workingDir = (0, path_1.resolve)();
  var configDir = process.env.STORYBOOK_CONFIG_DIR;
  var main = (0, getStorybookMain_1.getStorybookMain)(configDir);
  var normalizedStoriesEntries = (0, core_common_1.normalizeStories)(main.stories, {
    configDir: configDir,
    workingDir: workingDir,
  }).map(function (specifier) {
    return __assign(__assign({}, specifier), {
      importPathMatcher: new RegExp(specifier.importPathMatcher),
    });
  });
  var storiesPaths = normalizedStoriesEntries
    .map(function (entry) {
      return entry.directory + '/' + entry.files;
    })
    .map(function (dir) {
      return '<rootDir>/' + (0, path_1.relative)(workingDir, dir);
    })
    .join(';');
  // @ts-ignore -- this is added in @storybook/core-common@6.5, which we don't depend on
  var lazyCompilation = !!((_c =
    (_b =
      (_a = main === null || main === void 0 ? void 0 : main.core) === null || _a === void 0
        ? void 0
        : _a.builder) === null || _b === void 0
      ? void 0
      : _b.options) === null || _c === void 0
    ? void 0
    : _c.lazyCompilation);
  return {
    configDir: configDir,
    workingDir: workingDir,
    storiesPaths: storiesPaths,
    normalizedStoriesEntries: normalizedStoriesEntries,
    lazyCompilation: lazyCompilation,
  };
};
exports.getStorybookMetadata = getStorybookMetadata;
