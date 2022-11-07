"use strict";

var _getCliOptions = require("./getCliOptions");
var cliHelper = _interopRequireWildcard(require("./getParsedCliOptions"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
describe('getCliOptions', () => {
  it('returns custom options if passed', () => {
    const customConfig = {
      configDir: 'custom',
      indexJson: true
    };
    jest.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValue({
      options: customConfig,
      extraArgs: []
    });
    const opts = (0, _getCliOptions.getCliOptions)();
    expect(opts.runnerOptions).toMatchObject(customConfig);
  });
});