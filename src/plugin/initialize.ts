// Initializes the lib to start listening for events

import { initializers, Observer } from "./observers";
import { createWsClient } from "./managers";
import { SaveFixture } from "./types";
import { aliasTracker } from "./utils/aliases";

const initialize = (
  clientId: string,
  observers: Observer[],
  saveFixture: SaveFixture,
  devMode = false
) => {
  const buildAlias = aliasTracker();

  const { close, ...args } = {
    ...createWsClient(clientId, devMode),
    saveFixture,
    buildAlias,
  };

  observers.forEach((observer) => {
    initializers[observer](args);
  });

  return () => {
    const sessionId = close();
    return sessionId;
  };
};

export default initialize;
