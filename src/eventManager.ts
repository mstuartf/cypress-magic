// Stores all events and handles pushing them to the server

import { DiffEvent, InitArgs, ParsedEvent } from "./types";
import { initializeDomObserver } from "./diffDom";
import { createWsClient } from "./createWSClient";
import { createSessionId } from "./createSessionId";
import { readClientId } from "./globals";

export const createEventManager = ({
  removeStateData,
}: Pick<InitArgs, "removeStateData">) => {
  const sessionId = createSessionId();
  const clientId = readClientId();
  const domain = window.location.hostname;

  const { createDiffEvent } = initializeDomObserver({ removeStateData });

  const ws = createWsClient();

  const sendEvent = (event: ParsedEvent) => {
    ws.sendEvent({
      clientId,
      sessionId,
      domain,
      event,
    });
  };

  const saveEvent = (event: ParsedEvent) => {
    sendEvent(event);

    // After every event check to see if the DOM has changed. This will allow us to filter out events that do nothing
    // (e.g. random background clicks) to better group journeys together.
    const diffEvent: DiffEvent | null = createDiffEvent();
    if (diffEvent) {
      sendEvent(diffEvent);
    }
  };

  return { saveEvent };
};
