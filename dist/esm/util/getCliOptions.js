import { getParsedCliOptions } from './getParsedCliOptions';
const STORYBOOK_RUNNER_COMMANDS = ['indexJson', 'configDir', 'browsers', 'eject', 'url', 'coverage', 'junit'];
export const getCliOptions = () => {
  const {
    options: allOptions,
    extraArgs
  } = getParsedCliOptions();
  const defaultOptions = {
    runnerOptions: {},
    jestOptions: process.argv.splice(0, 2)
  };
  const finalOptions = Object.keys(allOptions).reduce((acc, key) => {
    if (STORYBOOK_RUNNER_COMMANDS.includes(key)) {
      //@ts-ignore
      acc.runnerOptions[key] = allOptions[key];
    } else {
      if (allOptions[key] === true) {
        acc.jestOptions.push(`--${key}`);
      } else if (allOptions[key] === false) {
        acc.jestOptions.push(`--no-${key}`);
      } else {
        acc.jestOptions.push(`--${key}`, allOptions[key]);
      }
    }
    return acc;
  }, defaultOptions);
  if (extraArgs.length) {
    finalOptions.jestOptions.push(...extraArgs);
  }
  return finalOptions;
};