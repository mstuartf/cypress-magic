// Records the initial viewport size and listens for changes

import { InitArgs } from "../types";

export const initViewportObserver = ({ saveEvent }: InitArgs) => {
  saveEvent({
    type: "setViewport",
    timestamp: Date.now() - 1,
    width: window.innerWidth,
    height: window.innerHeight,
    // todo: un hard code
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: false,
  });
};
