// Initializes the lib to start listening for events

import { initializeUserEvents } from "./userEvents";
import { initialiseRequests } from "./requests";
import { initializeNav } from "./navigation";
import { initializeViewport } from "./viewport";
import { createEventManager } from "./eventManager";
import { createDownloadBtn } from "./createDownloadBtn";

const initialize = () => {
  const { saveEvent, getEvents } = createEventManager();
  initializeUserEvents(saveEvent);
  initialiseRequests(saveEvent);
  initializeNav(saveEvent);
  initializeViewport(saveEvent);
  createDownloadBtn(getEvents);
};

// needs to be in onload or body is null
window.onload = initialize;
