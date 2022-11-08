// Initializes the lib to start listening for events

import { readIsTestMode } from "./globals";
import { isChrome } from "./utils";
import { Observer, initializers } from "./observers";
import { createPrivacyManager, createWsClient } from "./managers";

const initialize = (
  clientId: string,
  observers: Observer[],
  devMode = false
) => {
  // if (!isChrome() || readIsTestMode()) {
  //   return;
  // }

  const { close, clear, ...args } = {
    ...createWsClient(clientId, devMode),
    ...createPrivacyManager(),
  };

  observers.forEach((observer) => {
    initializers[observer](args);
  });

  return () => {
    clear();
    const sessionId = close();
    return sessionId;
  };
};

export default initialize;
