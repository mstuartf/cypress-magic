import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./apps/widget/components/App";
import { store } from "./apps/widget/redux/store";
import { Provider } from "react-redux";
import { widgetId } from "./apps/widget/constants";
import initialize from "./plugin/initialize";
import { ParsedEvent } from "./plugin/types";
import {
  saveEvent,
  saveFixture,
  saveIsRunningResponse,
  updateAliasTracker,
  updateIsRunningAliasTracker,
} from "./apps/widget/redux/slice";
import { buildAliasTracker } from "./plugin/utils/aliases";
import {
  selectBaseUrl,
  selectMockedResponse,
  selectMockNetworkInTests,
} from "./apps/widget/redux/selectors";
import { isResponseEvent } from "./apps/widget/utils";
import $Commands from "./driver/src/cypress/commands";
import { Keyboard } from "./driver/src/cy/keyboard";
import $ from "jquery";
import Promise from "bluebird";

(window as any).Cypress = {
  isBrowser(name: Cypress.IsBrowserMatcher): boolean {
    return false;
  },
  ensure: {
    isElement: () => true,
    isAttached: () => true,
    isNotDisabled: () => true,
    isStrictlyVisible: () => true,
    isNotReadonly: () => true,
    isNotHiddenByAncestors: () => true,
  },
};

const _commands = {};
const commands = $Commands.create(
  {
    log: console.log,
    action: () => {},
  },
  {
    devices: {
      keyboard: new Keyboard(() => ({
        alt: true,
        ctrl: true,
        meta: true,
        shift: true,
      })),
    },
    subjectChain: console.log,
    getSubjectFromChain: () => $("#username"),
    state: () => ({
      get: () => "alksdjh",
    }),
    now: (name, ...rest) => {
      if (name === "type") {
        return _commands[name](...rest);
      }

      return Promise.resolve($("#username").click());
      // throw Error(`${name}!`)
    },
    addCommand: ({ name, fn }) => {
      _commands[name] = fn;
    },
  },
  console.log,
  console.log
);
console.log(commands["type"]);

setTimeout(() => {
  console.log("running");
  const $el = $("#username");
  console.log(commands);
  commands["type"]["fn"]($el, "anasdlkfjasf", {});
}, 2000);

interface W extends Window {
  cypressMagicHasLoaded?: boolean;
}

const getHasLoaded = (): boolean =>
  (window as any as W).cypressMagicHasLoaded || false;
const setHasLoaded = (value: boolean) =>
  ((window as any as W).cypressMagicHasLoaded = value);

// content script runs in the main process and in the extension popup, so need this check here
// because we only want to render the app in the main process
const { protocol } = new URL(window.location.href);
if (!protocol.includes("chrome-extension") && !getHasLoaded()) {
  // this needs to be done immediately (i.e. not in the app) to catch all events from the host page
  initialize({
    saveEvent: (event: ParsedEvent) => {
      const { isAddingCommands, isRunning } = store.getState().recording;
      if (isAddingCommands && !isRunning) {
        store.dispatch(saveEvent(event));
      } else if (isRunning && isResponseEvent(event)) {
        store.dispatch(saveIsRunningResponse(event));
      }
    },
    saveFixture: (name, pickle) => {
      const { isAddingCommands } = store.getState().recording;
      if (isAddingCommands) {
        store.dispatch(saveFixture({ name, pickle }));
      }
    },
    // aliases need to be stored in state so that counts do not reset if there is a reload() as part of a test
    buildAlias: buildAliasTracker(
      () =>
        store.getState().recording.isRunning
          ? store.getState().recording.isRunningAliasTracker
          : store.getState().recording.isAddingCommands
          ? store.getState().recording.aliasTracker
          : {},
      (updated) => {
        if (store.getState().recording.isRunning) {
          store.dispatch(updateIsRunningAliasTracker(updated));
        } else if (store.getState().recording.isAddingCommands) {
          store.dispatch(updateAliasTracker(updated));
        }
      }
    ),
    mockApiCalls: () => selectMockNetworkInTests(store.getState()),
    matchUrl: (url) => {
      const baseUrl = selectBaseUrl(store.getState());
      return !baseUrl || url.startsWith(baseUrl);
    },
    getMockedResponse: (alias) => selectMockedResponse(alias)(store.getState()),
  });

  const createRootElement = () => {
    const el = window.document.createElement("div");
    el.id = widgetId;
    window.document.body.appendChild(el);
    return el;
  };

  const root = ReactDOM.createRoot(
    window.document.getElementById(widgetId) || createRootElement()
  );
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
  setHasLoaded(true);
}
