// Initializes the lib to start listening for events

import { initializers, Observer } from "./observers";
import { InitArgs } from "./types";

const observers: Observer[] = [
  "history",
  "localStorage",
  "sessionStorage",
  "fetch",
  "user",
  "viewport",
  "xml",
  "cookies",
];

const initialize = (args: InitArgs) => {
  observers.forEach((observer) => {
    initializers[observer](args);
  });
};

export default initialize;
