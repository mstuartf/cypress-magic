// Initializes the lib to start listening for events

import { initializers, Observer } from "./observers";
import { MainInitArgs } from "./types";
import { buildAliasTracker } from "./utils/aliases";

const observers: Observer[] = ["history", "fetch", "user", "xml"];

const initialize = (args: MainInitArgs) => {
  const buildAlias = buildAliasTracker();
  observers.forEach((observer) => {
    initializers[observer]({ ...args, buildAlias });
  });
};

export default initialize;
