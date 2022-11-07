'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getStorybookMain = void 0;
var path_1 = require('path');
var core_common_1 = require('@storybook/core-common');
var storybookMainConfig;
var getStorybookMain = function (configDir) {
  if (storybookMainConfig) {
    return storybookMainConfig;
  }
  storybookMainConfig = (0, core_common_1.serverRequire)(
    (0, path_1.join)((0, path_1.resolve)(configDir), 'main')
  );
  if (!storybookMainConfig) {
    throw new Error(
      'Could not load main.js in '.concat(
        configDir,
        '. Is the config directory correct? You can change it by using --config-dir <path-to-dir>'
      )
    );
  }
  return storybookMainConfig;
};
exports.getStorybookMain = getStorybookMain;
