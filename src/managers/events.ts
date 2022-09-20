// Stores all events and handles pushing them to the server

import { EventManager, OnSaveCallback, ParsedEvent } from "../types";
import { createWsClient } from "../sockets";
import { readClientId } from "../globals";
import { version } from "../../package.json";

export const createEventManager = (): EventManager => {
  const clientId = readClientId();
  const domain = window.location.hostname;

  const onSaveCallbacks: OnSaveCallback[] = [];

  const ws = createWsClient();

  const sendEvent = (event: ParsedEvent) => {
    ws.sendEvent({
      clientId,
      domain,
      event,
      version,
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
