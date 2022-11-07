"use strict";

var _tsDedent = _interopRequireDefault(require("ts-dedent"));
var _path = _interopRequireDefault(require("path"));
var coreCommon = _interopRequireWildcard(require("@storybook/core-common"));
var storybookMain = _interopRequireWildcard(require("../util/getStorybookMain"));
var _transformPlaywright = require("./transformPlaywright");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
jest.mock('@storybook/core-common');
expect.addSnapshotSerializer({
  print: val => val.trim(),
  test: val => true
});
describe('Playwright', () => {
  beforeEach(() => {
    const relativeSpy = jest.spyOn(_path.default, 'relative');
    relativeSpy.mockReturnValueOnce('stories/basic/Header.stories.js');
    jest.spyOn(storybookMain, 'getStorybookMain').mockImplementation(() => ({
      stories: [{
        directory: '../stories/basic',
        titlePrefix: 'Example'
      }]
    }));
    jest.spyOn(coreCommon, 'normalizeStories').mockImplementation(() => [{
      titlePrefix: 'Example',
      files: '**/*.stories.@(mdx|tsx|ts|jsx|js)',
      directory: './stories/basic',
      importPathMatcher: /^\.[\\/](?:stories\/basic(?:\/(?!\.)(?:(?:(?!(?:^|\/)\.).)*?)\/|\/|$)(?!\.)(?=.)[^/]*?\.stories\.(mdx|tsx|ts|jsx|js))$/
    }]);
  });
  const filename = './stories/basic/Header.stories.js';
  it('should generate a play test when the story has a play function', () => {
    expect((0, _transformPlaywright.transformPlaywright)((0, _tsDedent.default)`
        export default { title: 'foo/bar', component: Button };
        export const A = () => {};
        A.play = () => {};
      `, filename)).toMatchInlineSnapshot(`
      const global = require('global');

      const {
        setupPage
      } = require('@storybook/test-runner');

      if (!require.main) {
        describe("Example/foo/bar", () => {
          describe("A", () => {
            it("play-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-foo-bar--a",
                  title: "Example/foo/bar",
                  name: "A"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: "example-foo-bar--a",
                    err: err.message
                  });
                });
        
                if (global.__sbPreRender) {
                  await global.__sbPreRender(page, context);
                }
        
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: "example-foo-bar--a"
                });
        
                if (global.__sbPostRender) {
                  await global.__sbPostRender(page, context);
                }
        
                if (global.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
        
                  if (!isCoverageSetupCorrectly) {
                    throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
        The code in this story is not instrumented, which means the coverage setup is likely not correct.
        More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                  }
        
                  await jestPlaywright.saveCoverage(page);
                }
        
                return result;
              };
        
              try {
                await testFn();
              } catch (err) {
                if (err.toString().includes('Execution context was destroyed')) {
                  await jestPlaywright.resetPage();
                  await setupPage(global.page);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });
      }
    `);
  });
  it('should generate a smoke test when story does not have a play function', () => {
    expect((0, _transformPlaywright.transformPlaywright)((0, _tsDedent.default)`
        export default { title: 'foo/bar' };
        export const A = () => {};
      `, filename)).toMatchInlineSnapshot(`
      const global = require('global');

      const {
        setupPage
      } = require('@storybook/test-runner');

      if (!require.main) {
        describe("Example/foo/bar", () => {
          describe("A", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-foo-bar--a",
                  title: "Example/foo/bar",
                  name: "A"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: "example-foo-bar--a",
                    err: err.message
                  });
                });
        
                if (global.__sbPreRender) {
                  await global.__sbPreRender(page, context);
                }
        
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: "example-foo-bar--a"
                });
        
                if (global.__sbPostRender) {
                  await global.__sbPostRender(page, context);
                }
        
                if (global.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
        
                  if (!isCoverageSetupCorrectly) {
                    throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
        The code in this story is not instrumented, which means the coverage setup is likely not correct.
        More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                  }
        
                  await jestPlaywright.saveCoverage(page);
                }
        
                return result;
              };
        
              try {
                await testFn();
              } catch (err) {
                if (err.toString().includes('Execution context was destroyed')) {
                  await jestPlaywright.resetPage();
                  await setupPage(global.page);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });
      }
    `);
  });
  it('should generate a smoke test with auto title', () => {
    expect((0, _transformPlaywright.transformPlaywright)((0, _tsDedent.default)`
        export default { component: Button };
        export const A = () => {};
      `, filename)).toMatchInlineSnapshot(`
      const global = require('global');

      const {
        setupPage
      } = require('@storybook/test-runner');

      if (!require.main) {
        describe("Example/Header", () => {
          describe("A", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-header--a",
                  title: "Example/Header",
                  name: "A"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: "example-header--a",
                    err: err.message
                  });
                });
        
                if (global.__sbPreRender) {
                  await global.__sbPreRender(page, context);
                }
        
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: "example-header--a"
                });
        
                if (global.__sbPostRender) {
                  await global.__sbPostRender(page, context);
                }
        
                if (global.__sbCollectCoverage) {
                  const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
        
                  if (!isCoverageSetupCorrectly) {
                    throw new Error(\`[Test runner] An error occurred when evaluating code coverage:
        The code in this story is not instrumented, which means the coverage setup is likely not correct.
        More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage\`);
                  }
        
                  await jestPlaywright.saveCoverage(page);
                }
        
                return result;
              };
        
              try {
                await testFn();
              } catch (err) {
                if (err.toString().includes('Execution context was destroyed')) {
                  await jestPlaywright.resetPage();
                  await setupPage(global.page);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });
      }
    `);
  });
});