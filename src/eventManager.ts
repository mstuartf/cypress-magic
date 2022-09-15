// Stores all events and handles pushing them to the server

import { ParsedEvent } from "./types";
import { initializeDomObserver } from "./diffDom";
import { createWsClient } from "./createWSClient";
import { createSessionId } from "./createSessionId";
import { readClientId } from "./globals";

export const createEventManager = () => {
  const sessionId = createSessionId();
  const clientId = readClientId();

  const { createDiffEvent } = initializeDomObserver();

  const ws = createWsClient();

  const saveEvent = (event: ParsedEvent) => {
    ws.sendEvent(clientId, sessionId, event);

    // After every event check to see if the DOM has changed. This will allow us to filter out events that do nothing
    // (e.g. random background clicks) to better group journeys together.
    const diff = createDiffEvent();
    ws.sendEvent(clientId, sessionId, diff);
  };

  return { saveEvent };
};
