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

const initialize = (clientId: string, devMode = false) => {
  if (!isChrome() || readIsTestMode()) {
    return;
  }

  const { close, clear, ...args } = {
    ...createWsClient(clientId, devMode),
    ...createPrivacyManager(),
  };

  initUserObserver(args);
  initRequestsObserver(args);
  initNavObserver(args);
  initViewportObserver(args);
  initStorageObserver(args);

  return () => {
    clear();
    close();
  };
};

export default initialize;
