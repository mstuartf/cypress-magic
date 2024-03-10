import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./apps/widget/App";
import store from "./redux/proxy";
import { Provider } from "react-redux";

const id = "__widget__";

const createRootElement = () => {
  const el = window.document.createElement("div");
  el.id = id;
  el.style.position = "fixed";
  el.style.top = "0";
  el.style.right = "0";
  el.style.zIndex = "1000";
  window.document.body.appendChild(el);
  return el;
};

// content script runs in the main process and in the extension popup, so need this check here
// because we only want to render the app in the main process
const { protocol } = new URL(window.location.href);
if (!protocol.includes("chrome-extension")) {
  document.addEventListener("DOMContentLoaded", () => {
    const root = ReactDOM.createRoot(
      window.document.getElementById(id) || createRootElement()
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
