// Initializes the lib to start listening for events

import { readDomains } from "./globals";
import { version } from "../package.json";
import { isChrome } from "./utils";
import {
  initDomObserver,
  initNavObserver,
  initRequestsObserver,
  initStorageObserver,
  initUserObserver,
  initViewportObserver,
} from "./observers";
import { createPrivacyManager } from "./managers";
import { createEventManager } from "./managers";

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

  const args = { ...createEventManager(), ...createPrivacyManager() };

  initUserObserver(args);
  initRequestsObserver(args);
  initNavObserver(args);
  initViewportObserver(args);
  initStorageObserver(args);
  // initDomObserver(args);
};

initialize();
