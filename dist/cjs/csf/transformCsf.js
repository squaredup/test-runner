"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformCsf = exports.makeArray = void 0;
var _csfTools = require("@storybook/csf-tools");
var t = _interopRequireWildcard(require("@babel/types"));
var _generator = _interopRequireDefault(require("@babel/generator"));
var _csf = require("@storybook/csf");
var _tsDedent = _interopRequireDefault(require("ts-dedent"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/* eslint-disable no-underscore-dangle */

const logger = console;
const prefixFunction = (key, title, input, testPrefixer) => {
  const name = (0, _csf.storyNameFromExport)(key);
  const context = {
    storyExport: t.identifier(key),
    name: t.stringLiteral(name),
    // FIXME .name annotation
    title: t.stringLiteral(title),
    id: t.stringLiteral((0, _csf.toId)(title, name))
  };
  const result = makeArray(testPrefixer(context));
  const stmt = result[1];
  return stmt.expression;
};
const makePlayTest = (key, title, metaOrStoryPlay, testPrefix) => {
  return [t.expressionStatement(t.callExpression(t.identifier('it'), [t.stringLiteral(!!metaOrStoryPlay ? 'play-test' : 'smoke-test'), prefixFunction(key, title, metaOrStoryPlay, testPrefix)]))];
};
const makeDescribe = (key, tests, beforeEachBlock) => {
  const blockStatements = beforeEachBlock ? [beforeEachBlock, ...tests] : tests;
  return t.expressionStatement(t.callExpression(t.identifier('describe'), [t.stringLiteral(key), t.arrowFunctionExpression([], t.blockStatement(blockStatements))]));
};
const makeBeforeEach = beforeEachPrefixer => {
  const stmt = beforeEachPrefixer();
  return t.expressionStatement(t.callExpression(t.identifier('beforeEach'), [stmt.expression]));
};
const makeArray = templateResult => Array.isArray(templateResult) ? templateResult : [templateResult];
exports.makeArray = makeArray;
const transformCsf = (code, {
  filePrefixer,
  clearBody = false,
  testPrefixer,
  beforeEachPrefixer,
  insertTestIfEmpty,
  makeTitle
} = {}) => {
  const csf = (0, _csfTools.loadCsf)(code, {
    makeTitle
  });
  csf.parse();
  const storyExports = Object.keys(csf._stories);
  const title = csf.meta.title;
  const storyPlays = storyExports.reduce((acc, key) => {
    const annotations = csf._storyAnnotations[key];
    if (annotations?.play) {
      acc[key] = annotations.play;
    }
    return acc;
  }, {});
  const playTests = storyExports.map(key => {
    let tests = [];
    tests = [...tests, ...makePlayTest(key, title, storyPlays[key], testPrefixer)];
    if (tests.length) {
      return makeDescribe(key, tests);
    }
    return null;
  }).filter(Boolean);
  const allTests = playTests;
  let result = '';

  // FIXME: insert between imports
  if (filePrefixer) {
    const {
      code: prefixCode
    } = (0, _generator.default)(t.program(makeArray(filePrefixer())), {});
    result = `${prefixCode}\n`;
  }
  if (!clearBody) result = `${result}${code}\n`;
  if (allTests.length) {
    const describe = makeDescribe(csf.meta.title, allTests, beforeEachPrefixer ? makeBeforeEach(beforeEachPrefixer) : undefined);
    const {
      code: describeCode
    } = (0, _generator.default)(describe, {});
    result = (0, _tsDedent.default)`
      ${result}
      if (!require.main) {
        ${describeCode}
      }
    `;
  } else if (insertTestIfEmpty) {
    result = `describe('${csf.meta.title}', () => { it('no-op', () => {}) });`;
  }
  return result;
};
exports.transformCsf = transformCsf;