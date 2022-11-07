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
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.transformPlaywrightJson = void 0;
var t = __importStar(require('@babel/types'));
var generator_1 = __importDefault(require('@babel/generator'));
var csf_1 = require('@storybook/csf');
var ts_dedent_1 = __importDefault(require('ts-dedent'));
var transformPlaywright_1 = require('./transformPlaywright');
var transformCsf_1 = require('../csf/transformCsf');
var makeTest = function (entry) {
  var result = (0, transformPlaywright_1.testPrefixer)({
    name: t.stringLiteral(entry.name),
    title: t.stringLiteral(entry.title),
    id: t.stringLiteral(entry.id),
    // FIXME
    storyExport: t.identifier(entry.id),
  });
  var stmt = result[1];
  return t.expressionStatement(
    t.callExpression(t.identifier('it'), [t.stringLiteral('test'), stmt.expression])
  );
};
var makeDescribe = function (title, stmts) {
  return t.expressionStatement(
    t.callExpression(t.identifier('describe'), [
      t.stringLiteral(title),
      t.arrowFunctionExpression([], t.blockStatement(stmts)),
    ])
  );
};
var isV3DocsOnly = function (stories) {
  return stories.length === 1 && stories[0].name === 'Page';
};
function v3TitleMapToV4TitleMap(titleIdToStories) {
  return Object.fromEntries(
    Object.entries(titleIdToStories).map(function (_a) {
      var id = _a[0],
        stories = _a[1];
      return [
        id,
        stories.map(function (_a) {
          var parameters = _a.parameters,
            story = __rest(_a, ['parameters']);
          return __assign({ type: isV3DocsOnly(stories) ? 'docs' : 'story' }, story);
        }),
      ];
    })
  );
}
function groupByTitleId(entries) {
  return entries.reduce(function (acc, entry) {
    var titleId = (0, csf_1.toId)(entry.title);
    acc[titleId] = acc[titleId] || [];
    acc[titleId].push(entry);
    return acc;
  }, {});
}
/**
 * Generate one test file per component so that Jest can
 * run them in parallel.
 */
var transformPlaywrightJson = function (index) {
  var titleIdToEntries;
  if (index.v === 3) {
    var titleIdToStories = groupByTitleId(Object.values(index.stories));
    titleIdToEntries = v3TitleMapToV4TitleMap(titleIdToStories);
  } else if (index.v === 4) {
    titleIdToEntries = groupByTitleId(Object.values(index.entries));
  } else {
    throw new Error('Unsupported version '.concat(index.v));
  }
  var titleIdToTest = Object.entries(titleIdToEntries).reduce(function (acc, _a) {
    var titleId = _a[0],
      entries = _a[1];
    var stories = entries.filter(function (s) {
      return s.type !== 'docs';
    });
    if (stories.length) {
      var storyTests = stories.map(function (story) {
        return makeDescribe(story.name, [makeTest(story)]);
      });
      var program = t.program([makeDescribe(stories[0].title, storyTests)]);
      var testCode = (0, generator_1.default)(program, {}).code;
      var prefixCode = (0, generator_1.default)(
        t.program((0, transformCsf_1.makeArray)((0, transformPlaywright_1.filePrefixer)())),
        {}
      ).code;
      var code = (0, ts_dedent_1.default)(
        templateObject_1 ||
          (templateObject_1 = __makeTemplateObject(['', '\n', ''], ['', '\\n', ''])),
        prefixCode,
        testCode
      );
      acc[titleId] = code;
    }
    return acc;
  }, {});
  return titleIdToTest;
};
exports.transformPlaywrightJson = transformPlaywrightJson;
var templateObject_1;
