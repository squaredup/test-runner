"use strict";

var _getStorybookMain = require("./getStorybookMain");
var coreCommon = _interopRequireWildcard(require("@storybook/core-common"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
jest.mock('@storybook/core-common');
describe('getStorybookMain', () => {
  it('should throw an error if no configuration is found', () => {
    expect(() => (0, _getStorybookMain.getStorybookMain)('.storybook')).toThrow();
  });
  it('should return mainjs', () => {
    const mockedMain = {
      stories: [{
        directory: '../stories/basic',
        titlePrefix: 'Example'
      }]
    };
    jest.spyOn(coreCommon, 'serverRequire').mockImplementation(() => mockedMain);
    const res = (0, _getStorybookMain.getStorybookMain)('.storybook');
    expect(res).toMatchObject(mockedMain);
  });
});