import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./apps/widget/App";
import { store } from "./apps/widget/redux/store";
import { Provider } from "react-redux";
import { widgetId } from "./apps/widget/constants";
import initialize from "./plugin/initialize";
import { ParsedEvent } from "./plugin/types";
import { saveEvent, saveFixture } from "./apps/widget/redux/slice";

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
    saveFixture: (name, value) => store.dispatch(saveFixture({ name, value })),
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
