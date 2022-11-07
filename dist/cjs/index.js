"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _hooks = require("./playwright/hooks");
Object.keys(_hooks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _hooks[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _hooks[key];
    }
  });
});
var _jestPlaywright = require("./config/jest-playwright");
Object.keys(_jestPlaywright).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _jestPlaywright[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _jestPlaywright[key];
    }
  });
});
var _setupPage = require("./setup-page");
Object.keys(_setupPage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _setupPage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _setupPage[key];
    }
  });
});
var _getTestRunnerConfig = require("./util/getTestRunnerConfig");
Object.keys(_getTestRunnerConfig).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _getTestRunnerConfig[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getTestRunnerConfig[key];
    }
  });
});