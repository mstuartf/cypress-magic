// Initializes the lib to start listening for events

import { initializeUserEvents } from "./userEvents";
import { initialiseRequests } from "./requests";
import { initializeNav } from "./navigation";
import { initializeViewport } from "./viewport";
import { createEventManager } from "./eventManager";
import { readDomains } from "./globals";
import { version } from "../package.json";
import { isChrome } from "./isChrome";
import { initializeStorage } from "./storage";
import { createPrivacyManager } from "./obfuscate";

const initialize = () => {
  const domains = readDomains();
  if (!domains.includes(window.location.hostname)) {
    console.log("hostname not supported");
    return;
  }

  if (!isChrome()) {
    console.log("browser not supported");
    return;
  }

  console.log(`td version ${version} active`);

  const { obfuscate, removeStateData } = createPrivacyManager();
  const { saveEvent } = createEventManager({ removeStateData });

  initializeUserEvents({ saveEvent, obfuscate, removeStateData });
  initialiseRequests({ saveEvent, obfuscate });
  initializeNav({ saveEvent });
  initializeViewport({ saveEvent });
  initializeStorage({ saveEvent, obfuscate });
};

initialize();
