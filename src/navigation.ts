// Listens for navigation events

function monkeyPatchHistory(history: History, saveEvent: (event: any) => void) {
  const baseEvent = {
    type: "urlChange",
    timestamp: Date.now(),
  };

  const pushState = history.pushState;
  history.pushState = function (state, unused, url) {
    saveEvent({ ...baseEvent, url });
    return pushState.apply(history, arguments);
  };

  const replaceState = history.replaceState;
  history.replaceState = function (state, unused, url) {
    saveEvent({ ...baseEvent, url });
    return replaceState.apply(history, arguments);
  };

  const back = history.back;
  history.back = function () {
    saveEvent({
      ...baseEvent,
      url: "back",
    });
    return back.apply(history, arguments);
  };

  const forward = history.forward;
  history.forward = function () {
    saveEvent({
      ...baseEvent,
      url: "forward",
    });
    return forward.apply(history, arguments);
  };

  const go = history.go;
  history.go = function (delta) {
    saveEvent({
      ...baseEvent,
      delta,
    });
    return go.apply(history, arguments);
  };
}

export const initializeNav = (saveEvent: (event: any) => void) => {
  monkeyPatchHistory(window.history, saveEvent);
  // this is only required once for the cy.visit at the start of the test
  saveEvent({
    type: "navigate",
    url: window.location.href,
  });
};
