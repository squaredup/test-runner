import * as t from '@babel/types';
export interface TestContext {
    storyExport?: t.Identifier;
    name: t.Literal;
    title: t.Literal;
    id: t.Literal;
}
declare type TemplateResult = t.Statement | t.Statement[];
export declare type FilePrefixer = () => TemplateResult;
export declare type TestPrefixer = (context: TestContext) => TemplateResult;
interface TransformOptions {
    clearBody?: boolean;
    filePrefixer?: FilePrefixer;
    beforeEachPrefixer?: FilePrefixer;
    testPrefixer?: TestPrefixer;
    insertTestIfEmpty?: boolean;
    makeTitle?: (userTitle: string) => string;
}
export declare const makeArray: (templateResult: TemplateResult) => t.Statement[];
export declare const transformCsf: (code: string, { filePrefixer, clearBody, testPrefixer, beforeEachPrefixer, insertTestIfEmpty, makeTitle, }?: TransformOptions) => string;
export {};
