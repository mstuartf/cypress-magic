import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { proxyStore } from "./proxyStore";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// wait for the store to connect to the background page
proxyStore.ready().then(() => {
  root.render(
    <React.StrictMode>
      <Provider store={proxyStore}>
        <App />
      </Provider>
    </React.StrictMode>
  );
});
