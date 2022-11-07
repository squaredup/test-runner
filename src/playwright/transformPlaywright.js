'use strict';
var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function (cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, 'raw', { value: raw });
    } else {
      cooked.raw = raw;
    }
    return cooked;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.transformPlaywright = exports.testPrefixer = exports.filePrefixer = void 0;
var path_1 = require('path');
var template_1 = __importDefault(require('@babel/template'));
var store_1 = require('@storybook/store');
var util_1 = require('../util');
var transformCsf_1 = require('../csf/transformCsf');
var ts_dedent_1 = __importDefault(require('ts-dedent'));
exports.filePrefixer = (0, template_1.default)(
  "\n  const global = require('global');\n  const { setupPage } = require('@storybook/test-runner');\n"
);
var coverageErrorMessage = (0, ts_dedent_1.default)(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      [
        '\n  [Test runner] An error occurred when evaluating code coverage:\n  The code in this story is not instrumented, which means the coverage setup is likely not correct.\n  More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\n',
      ],
      [
        '\n  [Test runner] An error occurred when evaluating code coverage:\n  The code in this story is not instrumented, which means the coverage setup is likely not correct.\n  More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\n',
      ]
    ))
);
exports.testPrefixer = (0, template_1.default)(
  "\n    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });\n    async () => {\n      const testFn = async() => {\n        const context = { id: %%id%%, title: %%title%%, name: %%name%% };\n\n        page.on('pageerror', (err) => {\n          page.evaluate(({ id, err }) => __throwError(id, err), { id: %%id%%, err: err.message });\n        });\n\n        if(global.__sbPreRender) {\n          await global.__sbPreRender(page, context);\n        }\n\n        const result = await page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {\n          id: %%id%%,\n        });\n  \n        if(global.__sbPostRender) {\n          await global.__sbPostRender(page, context);\n        }\n\n        if(global.__sbCollectCoverage) {\n          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);\n          if (!isCoverageSetupCorrectly) {\n            throw new Error(`".concat(
    coverageErrorMessage,
    "`);\n          }\n\n          await jestPlaywright.saveCoverage(page);\n        }\n\n        return result;\n      };\n\n      try {\n        await testFn();\n      } catch(err) {\n        if(err.toString().includes('Execution context was destroyed')) {\n          await jestPlaywright.resetPage();\n          await setupPage(global.page);\n          await testFn();\n        } else {\n          throw err;\n        }\n      }\n    }\n  "
  ),
  {
    plugins: ['jsx'],
  }
);
var makeTitleFactory = function (filename) {
  var _a = (0, util_1.getStorybookMetadata)(),
    workingDir = _a.workingDir,
    normalizedStoriesEntries = _a.normalizedStoriesEntries;
  var filePath = './' + (0, path_1.relative)(workingDir, filename);
  return function (userTitle) {
    return (0, store_1.userOrAutoTitle)(filePath, normalizedStoriesEntries, userTitle);
  };
};
var transformPlaywright = function (src, filename) {
  var result = (0, transformCsf_1.transformCsf)(src, {
    filePrefixer: exports.filePrefixer,
    testPrefixer: exports.testPrefixer,
    insertTestIfEmpty: true,
    clearBody: true,
    makeTitle: makeTitleFactory(filename),
  });
  return result;
};
exports.transformPlaywright = transformPlaywright;
var templateObject_1;
