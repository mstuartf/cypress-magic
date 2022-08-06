// Records the initial viewport size and listens for changes

export const initializeViewport = (saveEvent: (event: any) => void) => {
  saveEvent({
    type: "setViewport",
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
