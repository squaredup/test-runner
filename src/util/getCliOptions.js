'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getCliOptions = void 0;
var getParsedCliOptions_1 = require('./getParsedCliOptions');
var STORYBOOK_RUNNER_COMMANDS = [
  'indexJson',
  'configDir',
  'browsers',
  'eject',
  'url',
  'coverage',
  'junit',
];
var getCliOptions = function () {
  var _a;
  var _b = (0, getParsedCliOptions_1.getParsedCliOptions)(),
    allOptions = _b.options,
    extraArgs = _b.extraArgs;
  var defaultOptions = {
    runnerOptions: {},
    jestOptions: process.argv.splice(0, 2),
  };
  var finalOptions = Object.keys(allOptions).reduce(function (acc, key) {
    if (STORYBOOK_RUNNER_COMMANDS.includes(key)) {
      //@ts-ignore
      acc.runnerOptions[key] = allOptions[key];
    } else {
      if (allOptions[key] === true) {
        acc.jestOptions.push('--'.concat(key));
      } else if (allOptions[key] === false) {
        acc.jestOptions.push('--no-'.concat(key));
      } else {
        acc.jestOptions.push('--'.concat(key), allOptions[key]);
      }
    }
    return acc;
  }, defaultOptions);
  if (extraArgs.length) {
    (_a = finalOptions.jestOptions).push.apply(_a, extraArgs);
  }
  return finalOptions;
};
exports.getCliOptions = getCliOptions;
