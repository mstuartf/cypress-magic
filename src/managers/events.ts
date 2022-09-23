// Stores all events and handles pushing them to the server

import { EventManager, OnSaveCallback, ParsedEvent } from "../types";
import { createWsClient } from "../sockets";

export const createEventManager = (): EventManager => {
  const onSaveCallbacks: OnSaveCallback[] = [];

  const ws = createWsClient();

  const registerOnSave = (fn: OnSaveCallback) => {
    onSaveCallbacks.push(fn);
  };

  const saveEvent = (event: ParsedEvent) => {
    ws.sendEvent(event);
    onSaveCallbacks.forEach((fn) => fn(saveEvent));
  };

  return { saveEvent, registerOnSave };
};
