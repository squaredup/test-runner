'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.process = void 0;
var core_1 = require('@babel/core');
var transformPlaywright_1 = require('./transformPlaywright');
var process = function (src, filename, config) {
  var csfTest = (0, transformPlaywright_1.transformPlaywright)(src, filename);
  var result = (0, core_1.transform)(csfTest, {
    filename: filename,
    babelrc: false,
    configFile: false,
    presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
  });
  return result ? result.code : src;
};
exports.process = process;
