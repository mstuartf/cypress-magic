// Records the initial viewport size and listens for changes

import { SaveEvent } from "./types";

export const initializeViewport = (saveEvent: SaveEvent) => {
  saveEvent({
    type: "setViewport",
    timestamp: Date.now(),
    width: window.innerWidth,
    height: window.innerHeight,
    // todo: un hard code
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false,
  });
  // todo: listen for changes?
};
