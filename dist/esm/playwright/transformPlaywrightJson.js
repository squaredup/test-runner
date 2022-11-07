import * as t from '@babel/types';
import generate from '@babel/generator';
import { toId } from '@storybook/csf';
import dedent from 'ts-dedent';
import { filePrefixer, testPrefixer } from './transformPlaywright';
import { makeArray } from '../csf/transformCsf';
const makeTest = entry => {
  const result = testPrefixer({
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
    const titleId = toId(entry.title);
    acc[titleId] = acc[titleId] || [];
    acc[titleId].push(entry);
    return acc;
  }, {});
}

/**
 * Generate one test file per component so that Jest can
 * run them in parallel.
 */
export const transformPlaywrightJson = index => {
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
      } = generate(program, {});
      const {
        code: prefixCode
      } = generate(t.program(makeArray(filePrefixer())), {});
      const code = dedent`${prefixCode}\n${testCode}`;
      acc[titleId] = code;
    }
    return acc;
  }, {});
  return titleIdToTest;
};