import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./apps/widget/App";
import { store } from "./apps/widget/redux/store";
import { Provider } from "react-redux";

const id = "__widget__";
const sideBarWith = 384;

const createRootElement = () => {
  const el = window.document.createElement("div");
  el.id = id;
  el.style.position = "fixed";
  el.style.bottom = "0";
  el.style.top = "0";
  el.style.right = "0";
  el.style.border = "2px solid blue";
  el.style.width = `${sideBarWith}px`;
  window.document.body.appendChild(el);
  return el;
};

const squash = () => {
  const body = document.getElementsByTagName("body")[0];
  body.style.width = `${window.innerWidth - sideBarWith}px`;
  Array.prototype.slice
    .call(document.body.getElementsByTagName("*"))
    .filter(
      (elem) =>
        window.getComputedStyle(elem, null).getPropertyValue("position") ==
        "fixed"
    )
    .filter((elem) => !elem.style.width)
    .forEach(
      (elem) => (elem.style.width = `${window.innerWidth - sideBarWith}px`)
    );
};

// content script runs in the main process and in the extension popup, so need this check here
// because we only want to render the app in the main process
const { protocol } = new URL(window.location.href);
if (!protocol.includes("chrome-extension")) {
  document.addEventListener("DOMContentLoaded", () => {
    squash();
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
