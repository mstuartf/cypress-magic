// Stores all events and handles pushing them to the server

import { ParsedEvent } from "./types";
import { initializeDomObserver } from "./diffDom";

export const createEventManager = () => {
  const events: ParsedEvent[] = [];

  const { createDiffEvent } = initializeDomObserver();

  const saveEvent = (event: ParsedEvent) => {
    events.push(event);
    // After every event check to see if the DOM has changed. This will allow us to filter out events that do nothing
    // (e.g. random background clicks) to better group journeys together.
    events.push(createDiffEvent());
    // todo: push to the server in real time?
  };

  const getEvents = () => events;

  return {
    saveEvent,
    getEvents,
  };
};
