// Initializes the lib to start listening for events

import { readIsTestMode } from "./globals";
import { isChrome } from "./utils";
import {
  initNavObserver,
  initRequestsObserver,
  initStorageObserver,
  initUserObserver,
  initViewportObserver,
} from "./observers";
import { createPrivacyManager, createWsClient } from "./managers";
import { InitArgs } from "./types";

const initialize = () => {
  if (!isChrome() || readIsTestMode()) {
    return;
  }

  const args: InitArgs = { ...createWsClient(), ...createPrivacyManager() };

  initUserObserver(args);
  initRequestsObserver(args);
  initNavObserver(args);
  initViewportObserver(args);
  initStorageObserver(args);
};

try {
  initialize();
} catch (e) {
  console.log("error loading Seasmoke");
}
