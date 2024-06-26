import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./apps/popup/App";
import { Provider } from "react-redux";
import store from "./apps/popup/redux/proxy";

const root = ReactDOM.createRoot(
  document.getElementById("__popup__") as HTMLElement
);

// wait for the store to connect to the background page
store.ready().then(() => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
});
