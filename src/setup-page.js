'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.setupPage = void 0;
var read_pkg_up_1 = __importDefault(require('read-pkg-up'));
var sanitizeURL = function (url) {
  var finalURL = url;
  // prepend URL protocol if not there
  if (finalURL.indexOf('http://') === -1 && finalURL.indexOf('https://') === -1) {
    finalURL = 'http://' + finalURL;
  }
  // remove iframe.html if present
  finalURL = finalURL.replace(/iframe.html\s*$/, '');
  // remove index.html if present
  finalURL = finalURL.replace(/index.html\s*$/, '');
  // add forward slash at the end if not there
  if (finalURL.slice(-1) !== '/') {
    finalURL = finalURL + '/';
  }
  return finalURL;
};
var setupPage = function (page) {
  return __awaiter(void 0, void 0, void 0, function () {
    var targetURL,
      viewMode,
      renderedEvent,
      packageJson,
      testRunnerVersion,
      referenceURL,
      debugPrintLimit;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          targetURL = new URL('iframe.html', process.env.TARGET_URL).toString();
          viewMode = process.env.VIEW_MODE || 'story';
          renderedEvent = viewMode === 'docs' ? 'docsRendered' : 'storyRendered';
          return [4 /*yield*/, (0, read_pkg_up_1.default)()];
        case 1:
          packageJson = _a.sent().packageJson;
          testRunnerVersion = packageJson.version;
          referenceURL = process.env.REFERENCE_URL && sanitizeURL(process.env.REFERENCE_URL);
          debugPrintLimit = process.env.DEBUG_PRINT_LIMIT
            ? Number(process.env.DEBUG_PRINT_LIMIT)
            : 1000;
          if ('TARGET_URL' in process.env && !process.env.TARGET_URL) {
            console.log(
              'Received TARGET_URL but with a falsy value: '
                .concat(process.env.TARGET_URL, ', will fallback to ')
                .concat(targetURL, ' instead.')
            );
          }
          return [
            4 /*yield*/,
            page.goto(targetURL, { waitUntil: 'load' }).catch(function (err) {
              var _a;
              if (
                (_a = err.message) === null || _a === void 0
                  ? void 0
                  : _a.includes('ERR_CONNECTION_REFUSED')
              ) {
                var errorMessage = 'Could not access the Storybook instance at '
                  .concat(targetURL, ". Are you sure it's running?\n\n")
                  .concat(err.message);
                throw new Error(errorMessage);
              }
              throw err;
            }),
          ];
        case 2:
          _a.sent();
          // if we ever want to log something from the browser to node
          return [
            4 /*yield*/,
            page.exposeBinding('logToPage', function (_, message) {
              return console.log(message);
            }),
          ];
        case 3:
          // if we ever want to log something from the browser to node
          _a.sent();
          return [
            4 /*yield*/,
            page.addScriptTag({
              content:
                "\n      // colorizes the console output\n      const bold = (message) => `\\u001b[1m${message}\\u001b[22m`;\n      const magenta = (message) => `\\u001b[35m${message}\\u001b[39m`;\n      const blue = (message) => `\\u001b[34m${message}\\u001b[39m`;\n      const red = (message) => `\\u001b[31m${message}\\u001b[39m`;\n      const yellow = (message) => `\\u001b[33m${message}\\u001b[39m`;\n      \n      // removes circular references from the object\n      function serializer(replacer, cycleReplacer) {\n        let stack = [],\n          keys = [];\n\n        if (cycleReplacer == null)\n          cycleReplacer = function (_key, value) {\n            if (stack[0] === value) return '[Circular]';\n            return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';\n          };\n\n        return function (key, value) {\n          if (stack.length > 0) {\n            let thisPos = stack.indexOf(this);\n            ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);\n            ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);\n            if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);\n          } else {\n            stack.push(value);\n          }\n\n          return replacer == null ? value : replacer.call(this, key, value);\n        };\n      }\n\n      function safeStringify(obj, replacer, spaces, cycleReplacer) {\n        return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);\n      }\n\n      function composeMessage(args) {\n        if (typeof args === 'undefined') return \"undefined\";\n        if (typeof args === 'string') return args;\n        return safeStringify(args);\n      }\n\n      function truncate(input, limit) {\n        if (input.length > limit) {\n          return input.substring(0, limit) + '\u2026';\n        }\n        return input;\n      }\n      \n      function addToUserAgent(extra) {\n        const originalUserAgent = globalThis.navigator.userAgent;\n        if (!originalUserAgent.includes(extra)) {\n          Object.defineProperty(globalThis.navigator, 'userAgent', {\n            get: function () {\n              return [originalUserAgent, extra].join(' ');\n            },\n          });\n        }\n      };\n\n      class StorybookTestRunnerError extends Error {\n        constructor(storyId, errorMessage, logs = []) {\n          super(errorMessage);\n          this.name = 'StorybookTestRunnerError';\n          const storyUrl = `"
                  .concat(
                    referenceURL || targetURL,
                    "?path=/story/${storyId}`;\n          const finalStoryUrl = `${storyUrl}&addonPanel=storybook/interactions/panel`;\n          const separator = '\\n\\n--------------------------------------------------';\n          const extraLogs = logs.length > 0 ? separator + \"\\n\\nBrowser logs:\\n\\n\"+ logs.join('\\n\\n') : '';\n\n          this.message = `\nAn error occurred in the following story. Access the link for full output:\n${finalStoryUrl}\n\nMessage:\n ${truncate(errorMessage,"
                  )
                  .concat(
                    debugPrintLimit,
                    ")}\n${extraLogs}`;\n        }\n      }\n\n      async function __throwError(storyId, errorMessage, logs) {\n        throw new StorybookTestRunnerError(storyId, errorMessage, logs);\n      }\n\n      async function __waitForStorybook() {\n        return new Promise((resolve, reject) => {\n\n          const timeout = setTimeout(() => {\n            reject();\n          }, 10000);\n\n          if (document.querySelector('#root') || document.querySelector('#storybook-root')) {\n            clearTimeout(timeout);\n            return resolve();\n          }\n\n          const observer = new MutationObserver(mutations => {\n            if (document.querySelector('#root') || document.querySelector('#storybook-root')) {\n              clearTimeout(timeout);\n              resolve();\n              observer.disconnect();\n            }\n          });\n\n          observer.observe(document.body, {\n            childList: true,\n            subtree: true\n          });\n        });\n      }\n\n      async function __getContext(storyId) {\n        return globalThis.__STORYBOOK_PREVIEW__.storyStore.loadStory({ storyId });\n      }\n\n      async function __test(storyId) {\n        try {\n          await __waitForStorybook();\n        } catch(err) {\n          const message = `Timed out waiting for Storybook to load after 10 seconds. Are you sure the Storybook is running correctly in that URL? Is the Storybook private (e.g. under authentication layers)?\n\n\nHTML: ${document.body.innerHTML}`;\n          throw new StorybookTestRunnerError(storyId, message);\n        }\n\n        const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;\n        if(!channel) {\n          throw new StorybookTestRunnerError(\n            storyId,\n            'The test runner could not access the Storybook channel. Are you sure the Storybook is running correctly in that URL?'\n          );\n        }\n        \n        addToUserAgent(`(StorybookTestRunner@"
                  )
                  .concat(
                    testRunnerVersion,
                    ")`);\n\n        // collect logs to show upon test error\n        let logs = [];\n\n        const spyOnConsole = (method, name) => {\n          const originalFn = console[method];\n          return function () {\n            const message = [...arguments].map(composeMessage).join(', ');\n            const prefix = `${bold(name)}: `;\n            logs.push(prefix + message);\n            originalFn.apply(console, arguments);\n          };\n        };\n\n        // console methods + color function for their prefix\n        const spiedMethods = {\n          log: blue,\n          warn: yellow,\n          error: red,\n          trace: magenta,\n          group: magenta,\n          groupCollapsed: magenta,\n        }\n        \n        Object.entries(spiedMethods).forEach(([method, color]) => {\n          console[method] = spyOnConsole(method, color(method))\n        })\n\n        return new Promise((resolve, reject) => {\n          channel.on('"
                  )
                  .concat(
                    renderedEvent,
                    "', () => resolve(document.getElementById('root')));\n          channel.on('storyUnchanged', () => resolve(document.getElementById('root')));\n          channel.on('storyErrored', ({ description }) => reject(\n            new StorybookTestRunnerError(storyId, description, logs))\n          );\n          channel.on('storyThrewException', (error) => reject(\n            new StorybookTestRunnerError(storyId, error.message, logs))\n          );\n          channel.on('playFunctionThrewException', (error) => reject(\n            new StorybookTestRunnerError(storyId, error.message, logs))\n          );\n          channel.on('storyMissing', (id) => id === storyId && reject(\n            new StorybookTestRunnerError(storyId, 'The story was missing when trying to access it.', logs))\n          );\n\n          channel.emit('setCurrentStory', { storyId, viewMode: '"
                  )
                  .concat(viewMode, "' });\n        });\n      };\n    "),
            }),
          ];
        case 4:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
};
exports.setupPage = setupPage;
