// Listens for navigation events

import { BaseEvent, InitArgs, SaveEvent } from "../types";

function monkeyPatchHistory(history: History, saveEvent: SaveEvent) {
  const getBaseEvent = (): BaseEvent => ({
    type: "urlChange",
    timestamp: Date.now(),
  });

  const pushState = history.pushState;
  history.pushState = function (state, unused, url) {
    saveEvent({ ...getBaseEvent(), url });
    return pushState.apply(history, arguments);
  };

  const replaceState = history.replaceState;
  history.replaceState = function (state, unused, url) {
    saveEvent({ ...getBaseEvent(), url });
    return replaceState.apply(history, arguments);
  };

  const back = history.back;
  history.back = function () {
    saveEvent({
      ...getBaseEvent(),
      url: "back",
    });
    return back.apply(history, arguments);
  };

  const forward = history.forward;
  history.forward = function () {
    saveEvent({
      ...getBaseEvent(),
      url: "forward",
    });
    return forward.apply(history, arguments);
  };

  const go = history.go;
  history.go = function (delta) {
    saveEvent({
      ...getBaseEvent(),
      delta,
    });
    return go.apply(history, arguments);
  };
}

export const initNavObserver = ({ saveEvent }: InitArgs) => {
  monkeyPatchHistory(window.history, saveEvent);
  // this is only required once for the cy.visit at the start of the test
  saveEvent({
    type: "navigate",
    timestamp: Date.now(),
    url: window.location.href,
  });
};
