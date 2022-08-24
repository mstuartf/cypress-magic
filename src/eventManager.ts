// Stores all events and handles pushing them to the server

import { ParsedEvent } from "./types";
import { initializeDomObserver } from "./diffDom";

const SOCKET_URL = "ws://0.0.0.0:1337/ws/chat/events/";

const createWsClient = () => {
  const ws = new WebSocket(SOCKET_URL);

  ws.onclose = function (e) {
    console.error("Chat socket closed unexpectedly");
  };

  const send = (p: string) => {
    if (ws.readyState === 1) {
      ws.send(p);
    } else {
      setTimeout(() => {
        send(p);
      }, 1000);
    }
  };

  const sendEvent = (event: any) => {
    send(
      JSON.stringify({
        event: event,
      })
    );
  };

  return { sendEvent };
};

export const createEventManager = () => {
  const events: ParsedEvent[] = [];

  const { createDiffEvent } = initializeDomObserver();

  const ws = createWsClient();

  const saveEvent = (event: ParsedEvent) => {
    events.push(event);
    ws.sendEvent(event);

    // After every event check to see if the DOM has changed. This will allow us to filter out events that do nothing
    // (e.g. random background clicks) to better group journeys together.
    const diff = createDiffEvent();
    events.push(diff);
    ws.sendEvent(diff);
  };

  const getEvents = () => events;

  return {
    saveEvent,
    getEvents,
  };
};
