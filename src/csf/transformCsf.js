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
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.transformCsf = exports.makeArray = void 0;
/* eslint-disable no-underscore-dangle */
var csf_tools_1 = require('@storybook/csf-tools');
var t = __importStar(require('@babel/types'));
var generator_1 = __importDefault(require('@babel/generator'));
var csf_1 = require('@storybook/csf');
var ts_dedent_1 = __importDefault(require('ts-dedent'));
var logger = console;
var prefixFunction = function (key, title, input, testPrefixer) {
  var name = (0, csf_1.storyNameFromExport)(key);
  var context = {
    storyExport: t.identifier(key),
    name: t.stringLiteral(name),
    title: t.stringLiteral(title),
    id: t.stringLiteral((0, csf_1.toId)(title, name)),
  };
  var result = (0, exports.makeArray)(testPrefixer(context));
  var stmt = result[1];
  return stmt.expression;
};
var makePlayTest = function (key, title, metaOrStoryPlay, testPrefix) {
  return [
    t.expressionStatement(
      t.callExpression(t.identifier('it'), [
        t.stringLiteral(!!metaOrStoryPlay ? 'play-test' : 'smoke-test'),
        prefixFunction(key, title, metaOrStoryPlay, testPrefix),
      ])
    ),
  ];
};
var makeDescribe = function (key, tests, beforeEachBlock) {
  var blockStatements = beforeEachBlock ? __spreadArray([beforeEachBlock], tests, true) : tests;
  return t.expressionStatement(
    t.callExpression(t.identifier('describe'), [
      t.stringLiteral(key),
      t.arrowFunctionExpression([], t.blockStatement(blockStatements)),
    ])
  );
};
var makeBeforeEach = function (beforeEachPrefixer) {
  var stmt = beforeEachPrefixer();
  return t.expressionStatement(t.callExpression(t.identifier('beforeEach'), [stmt.expression]));
};
var makeArray = function (templateResult) {
  return Array.isArray(templateResult) ? templateResult : [templateResult];
};
exports.makeArray = makeArray;
var transformCsf = function (code, _a) {
  var _b = _a === void 0 ? {} : _a,
    filePrefixer = _b.filePrefixer,
    _c = _b.clearBody,
    clearBody = _c === void 0 ? false : _c,
    testPrefixer = _b.testPrefixer,
    beforeEachPrefixer = _b.beforeEachPrefixer,
    insertTestIfEmpty = _b.insertTestIfEmpty,
    makeTitle = _b.makeTitle;
  var csf = (0, csf_tools_1.loadCsf)(code, { makeTitle: makeTitle });
  csf.parse();
  var storyExports = Object.keys(csf._stories);
  var title = csf.meta.title;
  var storyPlays = storyExports.reduce(function (acc, key) {
    var annotations = csf._storyAnnotations[key];
    if (annotations === null || annotations === void 0 ? void 0 : annotations.play) {
      acc[key] = annotations.play;
    }
    return acc;
  }, {});
  var playTests = storyExports
    .map(function (key) {
      var tests = [];
      tests = __spreadArray(
        __spreadArray([], tests, true),
        makePlayTest(key, title, storyPlays[key], testPrefixer),
        true
      );
      if (tests.length) {
        return makeDescribe(key, tests);
      }
      return null;
    })
    .filter(Boolean);
  var allTests = playTests;
  var result = '';
  // FIXME: insert between imports
  if (filePrefixer) {
    var prefixCode = (0, generator_1.default)(
      t.program((0, exports.makeArray)(filePrefixer())),
      {}
    ).code;
    result = ''.concat(prefixCode, '\n');
  }
  if (!clearBody) result = ''.concat(result).concat(code, '\n');
  if (allTests.length) {
    var describe_1 = makeDescribe(
      csf.meta.title,
      allTests,
      beforeEachPrefixer ? makeBeforeEach(beforeEachPrefixer) : undefined
    );
    var describeCode = (0, generator_1.default)(describe_1, {}).code;
    result = (0, ts_dedent_1.default)(
      templateObject_1 ||
        (templateObject_1 = __makeTemplateObject(
          ['\n      ', '\n      if (!require.main) {\n        ', '\n      }\n    '],
          ['\n      ', '\n      if (!require.main) {\n        ', '\n      }\n    ']
        )),
      result,
      describeCode
    );
  } else if (insertTestIfEmpty) {
    result = "describe('".concat(csf.meta.title, "', () => { it('no-op', () => {}) });");
  }
  return result;
};
exports.transformCsf = transformCsf;
var templateObject_1;
