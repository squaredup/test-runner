"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStorybookMain = void 0;
var _path = require("path");
var _coreCommon = require("@storybook/core-common");
let storybookMainConfig;
const getStorybookMain = configDir => {
  if (storybookMainConfig) {
    return storybookMainConfig;
  }
  storybookMainConfig = (0, _coreCommon.serverRequire)((0, _path.join)((0, _path.resolve)(configDir), 'main'));
  if (!storybookMainConfig) {
    throw new Error(`Could not load main.js in ${configDir}. Is the config directory correct? You can change it by using --config-dir <path-to-dir>`);
  }
  return storybookMainConfig;
};
exports.getStorybookMain = getStorybookMain;