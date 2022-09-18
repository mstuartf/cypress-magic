// Stores all events and handles pushing them to the server

import { DiffEvent, InitArgs, ParsedEvent } from "./types";
import { initDomManager } from "./managers";
import { createWsClient } from "./sockets";
import { readSessionId } from "./globals";
import { readClientId } from "./globals";

export const createEventManager = ({
  removeStateData,
}: Pick<InitArgs, "removeStateData">) => {
  const sessionId = readSessionId();
  const clientId = readClientId();
  const domain = window.location.hostname;

  const { createDiffEvent } = initDomManager({ removeStateData });

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
