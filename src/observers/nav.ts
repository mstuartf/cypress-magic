// Listens for navigation events

import { BaseEvent, InitArgs, OnCloseCallback, SaveEvent } from "../types";
import { createErrorEvent } from "../utils/createErrorEvent";

const getBaseEvent = (): BaseEvent => ({
  type: "urlChange",
  timestamp: Date.now(),
});

function monkeyPatchHistory(
  history: History,
  saveEvent: SaveEvent
): OnCloseCallback {
  const pushState = history.pushState;
  history.pushState = function (state, unused, url) {
    try {
      saveEvent({ ...getBaseEvent(), url });
    } catch (e) {
      saveEvent(createErrorEvent("urlChange", e));
    }
    return pushState.apply(history, arguments);
  };

  const replaceState = history.replaceState;
  history.replaceState = function (state, unused, url) {
    try {
      saveEvent({ ...getBaseEvent(), url });
    } catch (e) {
      saveEvent(createErrorEvent("urlChange", e));
    }
    return replaceState.apply(history, arguments);
  };

  const back = history.back;
  history.back = function () {
    try {
      saveEvent({
        ...getBaseEvent(),
        url: "back",
      });
    } catch (e) {
      saveEvent(createErrorEvent("urlChange", e));
    }
    return back.apply(history, arguments);
  };

  const forward = history.forward;
  history.forward = function () {
    try {
      saveEvent({
        ...getBaseEvent(),
        url: "forward",
      });
    } catch (e) {
      saveEvent(createErrorEvent("urlChange", e));
    }
    return forward.apply(history, arguments);
  };

  const go = history.go;
  history.go = function (delta) {
    try {
      saveEvent({
        ...getBaseEvent(),
        delta,
      });
    } catch (e) {
      saveEvent(createErrorEvent("urlChange", e));
    }
    return go.apply(history, arguments);
  };

  return () => {
    history.pushState = pushState;
    history.replaceState = replaceState;
    history.back = back;
    history.forward = forward;
    history.go = go;
  };
}

export const initNavObserver = ({
  saveEvent,
  registerOnCloseCallback,
}: InitArgs) => {
  const removePatch = monkeyPatchHistory(window.history, saveEvent);
  // this is only required once for the cy.visit at the start of the test
  saveEvent({
    type: "navigate",
    timestamp: Date.now(),
    url: window.location.href,
  });
  registerOnCloseCallback(removePatch);
};
