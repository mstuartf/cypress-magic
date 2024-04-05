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
  updateAliasTracker,
  updateIsRunningAliasTracker,
} from "./apps/widget/redux/slice";
import { buildAliasTracker } from "./plugin/utils/aliases";
import {
  selectBaseUrl,
  selectMockedResponse,
  selectMockNetworkInTests,
} from "./apps/widget/redux/selectors";

interface W extends Window {
  seasmokeHasLoaded?: boolean;
}

const getHasLoaded = (): boolean =>
  (window as any as W).seasmokeHasLoaded || false;
const setHasLoaded = (value: boolean) =>
  ((window as any as W).seasmokeHasLoaded = value);

// content script runs in the main process and in the extension popup, so need this check here
// because we only want to render the app in the main process
const { protocol } = new URL(window.location.href);
if (!protocol.includes("chrome-extension") && !getHasLoaded()) {
  // this needs to be done immediately (i.e. not in the app) to catch all events from the host page
  initialize({
    saveEvent: (event: ParsedEvent) => store.dispatch(saveEvent(event)),
    saveFixture: (name, pickle) =>
      store.dispatch(saveFixture({ name, pickle })),
    // aliases need to be stored in state so that counts do not reset if there is a reload() as part of a test
    buildAlias: buildAliasTracker(
      () =>
        store.getState().recording.isRunning
          ? store.getState().recording.isRunningAliasTracker
          : store.getState().recording.aliasTracker,
      (updated) => {
        if (store.getState().recording.isRunning) {
          store.dispatch(updateIsRunningAliasTracker(updated));
        } else {
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

  console.log("INJECTED");
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
