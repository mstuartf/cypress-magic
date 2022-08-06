// Stores all events and handles pushing them to the server

import { ParsedEvent } from "./types";

export const createEventManager = () => {
  const events: ParsedEvent[] = [];

  const saveEvent = (event: ParsedEvent) => {
    events.push(event);
    // todo: push to the server in real time?
  };

  const getEvents = () => events;

  return {
    saveEvent,
    getEvents,
  };
};
