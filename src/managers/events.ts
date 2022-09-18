// Stores all events and handles pushing them to the server

import { EventManager, OnSaveCallback, ParsedEvent } from "../types";
import { createWsClient } from "../sockets";
import { readClientId, readSessionId } from "../globals";

export const createEventManager = (): EventManager => {
  const sessionId = readSessionId();
  const clientId = readClientId();
  const domain = window.location.hostname;

  const onSaveCallbacks: OnSaveCallback[] = [];

  const ws = createWsClient();

  const sendEvent = (event: ParsedEvent) => {
    ws.sendEvent({
      clientId,
      sessionId,
      domain,
      event,
    });
  };

  const registerOnSave = (fn: OnSaveCallback) => {
    onSaveCallbacks.push(fn);
  };

  const saveEvent = (event: ParsedEvent) => {
    sendEvent(event);
    onSaveCallbacks.forEach((fn) => fn(saveEvent));
  };

  return { saveEvent, registerOnSave };
};
