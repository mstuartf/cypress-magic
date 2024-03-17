import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./apps/widget/App";
import { store } from "./apps/widget/redux/store";
import { Provider } from "react-redux";
import { widgetId } from "./apps/widget/constants";
import initialize from "./plugin/initialize";
import { ParsedEvent } from "./plugin/types";
import { saveEvent } from "./apps/widget/redux/slice";

// this needs to be done immediately (i.e. not in the app) to catch all events from the host page
initialize({
  saveEvent: (event: ParsedEvent) => store.dispatch(saveEvent(event)),
  saveFixture: () => {},
});

const createRootElement = () => {
  const el = window.document.createElement("div");
  el.id = widgetId;
  window.document.body.appendChild(el);
  return el;
};

// content script runs in the main process and in the extension popup, so need this check here
// because we only want to render the app in the main process
const { protocol } = new URL(window.location.href);
if (!protocol.includes("chrome-extension")) {
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
}
