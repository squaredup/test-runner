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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getJestConfig = void 0;
var path_1 = __importDefault(require('path'));
/**
 * IMPORTANT NOTE:
 * Depending on the user's project and package manager, it's possible that jest-playwright-preset
 * is going to be located in @storybook/test-runner/node_modules OR in the root node_modules
 *
 * By setting `preset: 'jest-playwright-preset` the change of resolution issues is higher, because
 * the lib might be installed inside of @storybook/test-runner/node_modules but references as if it was
 * in the root node_modules.
 *
 * This function does the same thing as `preset: 'jest-playwright-preset` but makes sure that the
 * necessary moving parts are all required within the correct path.
 * */
var getJestPlaywrightConfig = function () {
  var presetBasePath = path_1.default.dirname(
    require.resolve('jest-playwright-preset', {
      paths: [path_1.default.join(__dirname, '../../node_modules')],
    })
  );
  var expectPlaywrightPath = path_1.default.dirname(
    require.resolve('expect-playwright', {
      paths: [path_1.default.join(__dirname, '../../node_modules')],
    })
  );
  return {
    runner: path_1.default.join(presetBasePath, 'runner.js'),
    globalSetup: '@storybook/test-runner/playwright/global-setup.js',
    globalTeardown: '@storybook/test-runner/playwright/global-teardown.js',
    testEnvironment: '@storybook/test-runner/playwright/custom-environment.js',
    setupFilesAfterEnv: [
      '@storybook/test-runner/playwright/jest-setup.js',
      expectPlaywrightPath,
      path_1.default.join(presetBasePath, 'lib', 'extends.js'),
    ],
  };
};
var getJestConfig = function () {
  var _a = process.env,
    TEST_ROOT = _a.TEST_ROOT,
    TEST_MATCH = _a.TEST_MATCH,
    STORYBOOK_STORIES_PATTERN = _a.STORYBOOK_STORIES_PATTERN,
    TEST_BROWSERS = _a.TEST_BROWSERS,
    STORYBOOK_COLLECT_COVERAGE = _a.STORYBOOK_COLLECT_COVERAGE,
    STORYBOOK_JUNIT = _a.STORYBOOK_JUNIT;
  var reporters = STORYBOOK_JUNIT ? ['default', 'jest-junit'] : ['default'];
  var config = __assign(
    {
      rootDir: process.cwd(),
      roots: TEST_ROOT ? [TEST_ROOT] : undefined,
      reporters: reporters,
      testMatch: STORYBOOK_STORIES_PATTERN && STORYBOOK_STORIES_PATTERN.split(';'),
      transform: {
        '^.+\\.stories\\.[jt]sx?$': '@storybook/test-runner/playwright/transform',
        '^.+\\.[jt]sx?$': 'babel-jest',
      },
      snapshotSerializers: ['jest-serializer-html'],
      testEnvironmentOptions: {
        'jest-playwright': {
          browsers: TEST_BROWSERS.split(',')
            .map(function (p) {
              return p.trim().toLowerCase();
            })
            .filter(Boolean),
          collectCoverage: STORYBOOK_COLLECT_COVERAGE === 'true',
        },
      },
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
      ],
      watchPathIgnorePatterns: ['coverage', '.nyc_output', '.cache'],
    },
    getJestPlaywrightConfig()
  );
  if (TEST_MATCH) {
    config.testMatch = [TEST_MATCH];
  }
  return config;
};
exports.getJestConfig = getJestConfig;
