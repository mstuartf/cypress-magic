// Initializes the lib to start listening for events

import { readDomains } from "./globals";
import { version } from "../package.json";
import { isChrome } from "./utils";
import {
  initNavObserver,
  initRequestsObserver,
  initStorageObserver,
  initUserObserver,
  initViewportObserver,
} from "./observers";
import { createPrivacyManager } from "./managers";
import { createEventManager } from "./events";

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
  const args = { saveEvent, obfuscate, removeStateData };

  initUserObserver(args);
  initRequestsObserver(args);
  initNavObserver(args);
  initViewportObserver(args);
  initStorageObserver(args);
};

initialize();
