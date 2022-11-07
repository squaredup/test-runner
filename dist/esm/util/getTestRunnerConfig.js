import { join, resolve } from 'path';
import { serverRequire } from '@storybook/core-common';
let testRunnerConfig;
let loaded = false;
export const getTestRunnerConfig = configDir => {
  // testRunnerConfig can be undefined
  if (loaded) {
    return testRunnerConfig;
  }
  testRunnerConfig = serverRequire(join(resolve(configDir), 'test-runner'));
  loaded = true;
  return testRunnerConfig;
};