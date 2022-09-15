// Initializes the lib to start listening for events

import { initializeUserEvents } from "./userEvents";
import { initialiseRequests } from "./requests";
import { initializeNav } from "./navigation";
import { initializeViewport } from "./viewport";
import { createEventManager } from "./eventManager";
import { readDomains } from "./globals";
import { version } from "../package.json";

const initialize = () => {
  const domains = readDomains();
  if (!domains.includes(window.location.hostname)) {
    return;
  }

  console.log(`td version ${version} active`);

  const { saveEvent } = createEventManager();
  initializeUserEvents(saveEvent);
  initialiseRequests(saveEvent);
  initializeNav(saveEvent);
  initializeViewport(saveEvent);
};

initialize();
