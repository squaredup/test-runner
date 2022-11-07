"use strict";

var storybookMain = _interopRequireWildcard(require("./getStorybookMain"));
var _getStorybookMetadata = require("./getStorybookMetadata");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
describe('getStorybookMetadata', () => {
  afterAll(() => {
    process.env.STORYBOOK_CONFIG_DIR = undefined;
  });
  it('should return configDir coming from environment variable', () => {
    const mockedMain = {
      stories: []
    };
    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const {
      configDir
    } = (0, _getStorybookMetadata.getStorybookMetadata)();
    expect(configDir).toEqual(process.env.STORYBOOK_CONFIG_DIR);
  });
  it('should return storiesPath with default glob from CSF3 style config', () => {
    const mockedMain = {
      stories: [{
        directory: '../stories/basic',
        titlePrefix: 'Example'
      }]
    };
    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const {
      storiesPaths
    } = (0, _getStorybookMetadata.getStorybookMetadata)();
    expect(storiesPaths).toMatchInlineSnapshot(`"<rootDir>/stories\\\\basic\\\\**\\\\*.@(mdx|stories.mdx|stories.tsx|stories.ts|stories.jsx|stories.js)"`);
  });
  it('should return storiesPath with glob defined in CSF2 style config', () => {
    const mockedMain = {
      stories: ['../**/stories/*.stories.@(js|ts)']
    };
    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const {
      storiesPaths
    } = (0, _getStorybookMetadata.getStorybookMetadata)();
    expect(storiesPaths).toMatchInlineSnapshot(`"<rootDir>/**\\\\stories\\\\*.stories.@(js|ts)"`);
  });
  it('should return storiesPath from mixed CSF2 and CSF3 style config', () => {
    const mockedMain = {
      stories: [{
        directory: '../stories/basic',
        titlePrefix: 'Example'
      }, '../stories/complex/*.stories.@(js|ts)']
    };
    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const {
      storiesPaths
    } = (0, _getStorybookMetadata.getStorybookMetadata)();
    expect(storiesPaths).toMatchInlineSnapshot(`"<rootDir>/stories\\\\basic\\\\**\\\\*.@(mdx|stories.mdx|stories.tsx|stories.ts|stories.jsx|stories.js);<rootDir>/stories\\\\complex\\\\*.stories.@(js|ts)"`);
  });
  it('should return lazyCompilation=false when unset', () => {
    const mockedMain = {
      stories: []
    };
    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    expect((0, _getStorybookMetadata.getStorybookMetadata)().lazyCompilation).toBe(false);
  });
  it('should return lazyCompilation=true when set', () => {
    const mockedMain = {
      stories: [],
      core: {
        builder: {
          name: 'webpack5',
          options: {
            lazyCompilation: true
          }
        }
      }
    };
    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    expect((0, _getStorybookMetadata.getStorybookMetadata)().lazyCompilation).toBe(true);
  });
});