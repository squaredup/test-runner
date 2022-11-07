"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformPlaywrightJson = void 0;
var t = _interopRequireWildcard(require("@babel/types"));
var _generator = _interopRequireDefault(require("@babel/generator"));
var _csf = require("@storybook/csf");
var _tsDedent = _interopRequireDefault(require("ts-dedent"));
var _transformPlaywright = require("./transformPlaywright");
var _transformCsf = require("../csf/transformCsf");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const makeTest = entry => {
  const result = (0, _transformPlaywright.testPrefixer)({
    name: t.stringLiteral(entry.name),
    title: t.stringLiteral(entry.title),
    id: t.stringLiteral(entry.id),
    // FIXME
    storyExport: t.identifier(entry.id)
  });
  const stmt = result[1];
  return t.expressionStatement(t.callExpression(t.identifier('it'), [t.stringLiteral('test'), stmt.expression]));
};
const makeDescribe = (title, stmts) => {
  return t.expressionStatement(t.callExpression(t.identifier('describe'), [t.stringLiteral(title), t.arrowFunctionExpression([], t.blockStatement(stmts))]));
};
const isV3DocsOnly = stories => stories.length === 1 && stories[0].name === 'Page';
function v3TitleMapToV4TitleMap(titleIdToStories) {
  return Object.fromEntries(Object.entries(titleIdToStories).map(([id, stories]) => [id, stories.map(({
    parameters,
    ...story
  }) => ({
    type: isV3DocsOnly(stories) ? 'docs' : 'story',
    ...story
  }))]));
}
function groupByTitleId(entries) {
  return entries.reduce((acc, entry) => {
    const titleId = (0, _csf.toId)(entry.title);
    acc[titleId] = acc[titleId] || [];
    acc[titleId].push(entry);
    return acc;
  }, {});
}

/**
 * Generate one test file per component so that Jest can
 * run them in parallel.
 */
const transformPlaywrightJson = index => {
  let titleIdToEntries;
  if (index.v === 3) {
    const titleIdToStories = groupByTitleId(Object.values(index.stories));
    titleIdToEntries = v3TitleMapToV4TitleMap(titleIdToStories);
  } else if (index.v === 4) {
    titleIdToEntries = groupByTitleId(Object.values(index.entries));
  } else {
    throw new Error(`Unsupported version ${index.v}`);
  }
  const titleIdToTest = Object.entries(titleIdToEntries).reduce((acc, [titleId, entries]) => {
    const stories = entries.filter(s => s.type !== 'docs');
    if (stories.length) {
      const storyTests = stories.map(story => makeDescribe(story.name, [makeTest(story)]));
      const program = t.program([makeDescribe(stories[0].title, storyTests)]);
      const {
        code: testCode
      } = (0, _generator.default)(program, {});
      const {
        code: prefixCode
      } = (0, _generator.default)(t.program((0, _transformCsf.makeArray)((0, _transformPlaywright.filePrefixer)())), {});
      const code = (0, _tsDedent.default)`${prefixCode}\n${testCode}`;
      acc[titleId] = code;
    }
    return acc;
  }, {});
  return titleIdToTest;
};
exports.transformPlaywrightJson = transformPlaywrightJson;