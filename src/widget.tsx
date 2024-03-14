import React from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./apps/widget/App";
import { store } from "./apps/widget/redux/store";
import { Provider } from "react-redux";
import { widgetId } from "./apps/widget/constants";

const createRootElement = () => {
  const el = window.document.createElement("div");
  el.id = widgetId;
  window.document.body.appendChild(el);
  return el;
};

// todo: may need to setup listeners before onload (below)

// content script runs in the main process and in the extension popup, so need this check here
// because we only want to render the app in the main process
const { protocol } = new URL(window.location.href);
if (!protocol.includes("chrome-extension")) {
  document.addEventListener("DOMContentLoaded", () => {
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
  });
}
