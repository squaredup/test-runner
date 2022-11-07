"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPreRender = exports.setPostRender = exports.getStoryContext = void 0;
var _global = _interopRequireDefault(require("global"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const setPreRender = preRender => {
  _global.default.__sbPreRender = preRender;
};
exports.setPreRender = setPreRender;
const setPostRender = postRender => {
  _global.default.__sbPostRender = postRender;
};
exports.setPostRender = setPostRender;
const getStoryContext = async (page, context) => {
  // @ts-ignore
  return page.evaluate(({
    storyId
  }) => globalThis.__getContext(storyId), {
    storyId: context.id
  });
};
exports.getStoryContext = getStoryContext;