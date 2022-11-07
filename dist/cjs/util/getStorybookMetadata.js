"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStorybookMetadata = void 0;
var _path = require("path");
var _coreCommon = require("@storybook/core-common");
var _getStorybookMain = require("./getStorybookMain");
const getStorybookMetadata = () => {
  const workingDir = (0, _path.resolve)();
  const configDir = process.env.STORYBOOK_CONFIG_DIR;
  const main = (0, _getStorybookMain.getStorybookMain)(configDir);
  const normalizedStoriesEntries = (0, _coreCommon.normalizeStories)(main.stories, {
    configDir,
    workingDir
  }).map(specifier => ({
    ...specifier,
    importPathMatcher: new RegExp(specifier.importPathMatcher)
  }));
  const storiesPaths = normalizedStoriesEntries.map(entry => entry.directory + '/' + entry.files).map(dir => '<rootDir>/' + (0, _path.relative)(workingDir, dir)).join(';');

  // @ts-ignore -- this is added in @storybook/core-common@6.5, which we don't depend on
  const lazyCompilation = !!main?.core?.builder?.options?.lazyCompilation;
  return {
    configDir,
    workingDir,
    storiesPaths,
    normalizedStoriesEntries,
    lazyCompilation
  };
};
exports.getStorybookMetadata = getStorybookMetadata;