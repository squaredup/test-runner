"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = void 0;
var _core = require("@babel/core");
var _transformPlaywright = require("./transformPlaywright");
const process = (src, filename, config) => {
  const csfTest = (0, _transformPlaywright.transformPlaywright)(src, filename);
  const result = (0, _core.transform)(csfTest, {
    filename,
    babelrc: false,
    configFile: false,
    presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react']
  });
  return result ? result.code : src;
};
exports.process = process;