/* eslint-disable no-underscore-dangle */
import { loadCsf } from '@storybook/csf-tools';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { storyNameFromExport, toId } from '@storybook/csf';
import dedent from 'ts-dedent';
const logger = console;
const prefixFunction = (key, title, input, testPrefixer) => {
  const name = storyNameFromExport(key);
  const context = {
    storyExport: t.identifier(key),
    name: t.stringLiteral(name),
    // FIXME .name annotation
    title: t.stringLiteral(title),
    id: t.stringLiteral(toId(title, name))
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
export const makeArray = templateResult => Array.isArray(templateResult) ? templateResult : [templateResult];
export const transformCsf = (code, {
  filePrefixer,
  clearBody = false,
  testPrefixer,
  beforeEachPrefixer,
  insertTestIfEmpty,
  makeTitle
} = {}) => {
  const csf = loadCsf(code, {
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
    } = generate(t.program(makeArray(filePrefixer())), {});
    result = `${prefixCode}\n`;
  }
  if (!clearBody) result = `${result}${code}\n`;
  if (allTests.length) {
    const describe = makeDescribe(csf.meta.title, allTests, beforeEachPrefixer ? makeBeforeEach(beforeEachPrefixer) : undefined);
    const {
      code: describeCode
    } = generate(describe, {});
    result = dedent`
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