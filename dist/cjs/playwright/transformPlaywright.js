"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformPlaywright = exports.testPrefixer = exports.filePrefixer = void 0;
var _path = require("path");
var _template = _interopRequireDefault(require("@babel/template"));
var _store = require("@storybook/store");
var _util = require("../util");
var _transformCsf = require("../csf/transformCsf");
var _tsDedent = _interopRequireDefault(require("ts-dedent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const filePrefixer = (0, _template.default)(`
  const global = require('global');
  const { setupPage } = require('@storybook/test-runner');
`);
exports.filePrefixer = filePrefixer;
const coverageErrorMessage = (0, _tsDedent.default)`
  [Test runner] An error occurred when evaluating code coverage:
  The code in this story is not instrumented, which means the coverage setup is likely not correct.
  More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage
`;
const testPrefixer = (0, _template.default)(`
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
    async () => {
      const testFn = async() => {
        const context = { id: %%id%%, title: %%title%%, name: %%name%% };

        page.on('pageerror', (err) => {
          page.evaluate(({ id, err }) => __throwError(id, err), { id: %%id%%, err: err.message });
        });

        if(global.__sbPreRender) {
          await global.__sbPreRender(page, context);
        }

        const result = await page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
          id: %%id%%,
        });
  
        if(global.__sbPostRender) {
          await global.__sbPostRender(page, context);
        }

        if(global.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(\`${coverageErrorMessage}\`);
          }

          await jestPlaywright.saveCoverage(page);
        }

        return result;
      };

      try {
        await testFn();
      } catch(err) {
        if(err.toString().includes('Execution context was destroyed')) {
          await jestPlaywright.resetPage();
          await setupPage(global.page);
          await testFn();
        } else {
          throw err;
        }
      }
    }
  `, {
  plugins: ['jsx']
});
exports.testPrefixer = testPrefixer;
const makeTitleFactory = filename => {
  const {
    workingDir,
    normalizedStoriesEntries
  } = (0, _util.getStorybookMetadata)();
  const filePath = './' + (0, _path.relative)(workingDir, filename);
  return userTitle => (0, _store.userOrAutoTitle)(filePath, normalizedStoriesEntries, userTitle);
};
const transformPlaywright = (src, filename) => {
  const result = (0, _transformCsf.transformCsf)(src, {
    filePrefixer,
    testPrefixer,
    insertTestIfEmpty: true,
    clearBody: true,
    makeTitle: makeTitleFactory(filename)
  });
  return result;
};
exports.transformPlaywright = transformPlaywright;