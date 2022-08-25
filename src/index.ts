// Initializes the lib to start listening for events

import { initializeUserEvents } from "./userEvents";
import { initialiseRequests } from "./requests";
import { initializeNav } from "./navigation";
import { initializeViewport } from "./viewport";
import { createEventManager } from "./eventManager";

const initialize = () => {
  console.log("new version");
  const { saveEvent } = createEventManager();
  initializeUserEvents(saveEvent);
  initialiseRequests(saveEvent);
  initializeNav(saveEvent);
  initializeViewport(saveEvent);
};

// needs to be in onload or body is null
window.onload = initialize;
