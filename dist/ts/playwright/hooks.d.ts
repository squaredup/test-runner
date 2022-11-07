import type { Page } from 'playwright';
import type { StoryContext } from '@storybook/csf';
export declare type TestContext = {
    id: string;
    title: string;
    name: string;
};
export declare type TestHook = (page: Page, context: TestContext) => Promise<void>;
export interface TestRunnerConfig {
    setup?: () => void;
    preRender?: TestHook;
    postRender?: TestHook;
}
export declare const setPreRender: (preRender: TestHook) => void;
export declare const setPostRender: (postRender: TestHook) => void;
export declare const getStoryContext: (page: Page, context: TestContext) => Promise<StoryContext>;
