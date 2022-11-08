// Listens for navigation events

import { BaseEvent, InitArgs, OnCloseCallback, SaveEvent } from "../types";
import { createErrorEvent } from "../utils/createErrorEvent";

const getBaseEvent = (): BaseEvent => ({
  type: "navigation",
  timestamp: Date.now(),
});

function isURL(url: string | URL): url is URL {
  return (url as URL).pathname !== undefined;
}

const getPathAndHost = (
  url: string | URL
): { pathname: string; hostname: string } => {
  if (isURL(url)) {
    return url;
  }
  return {
    hostname: window.location.hostname,
    pathname: url,
  };
};

function monkeyPatchHistory(
  history: History,
  saveEvent: SaveEvent
): OnCloseCallback {
  const pushState = history.pushState;
  history.pushState = function (state, unused, url) {
    if (url) {
      try {
        const { pathname, hostname } = getPathAndHost(url);
        saveEvent({ ...getBaseEvent(), pathname, hostname });
      } catch (e) {
        saveEvent(createErrorEvent("navigation", e as any));
      }
    }
    return pushState.apply(history, arguments as any);
  };

  const replaceState = history.replaceState;
  history.replaceState = function (state, unused, url) {
    if (url) {
      try {
        const { pathname, hostname } = getPathAndHost(url);
        saveEvent({ ...getBaseEvent(), pathname, hostname });
      } catch (e) {
        saveEvent(createErrorEvent("navigation", e as any));
      }
    }
    return replaceState.apply(history, arguments as any);
  };

  // listen to popstate for back, forward and go (async)
  const listener: EventListener = (event) => {
    try {
      const { hostname, pathname } = window.location;
      saveEvent({ ...getBaseEvent(), pathname, hostname });
    } catch (e) {
      saveEvent(createErrorEvent("navigation", e as any));
    }
  };
  window.addEventListener("popstate", listener);

  return () => {
    history.pushState = pushState;
    history.replaceState = replaceState;
    window.removeEventListener("popstate", listener);
  };
}

export const initHistoryObserver = ({
  saveEvent,
  registerOnCloseCallback,
}: InitArgs) => {
  const removePatch = monkeyPatchHistory(window.history, saveEvent);
  const { pathname, hostname } = new URL(window.location.href);
  saveEvent({
    ...getBaseEvent(),
    pathname,
    hostname,
  });
  registerOnCloseCallback(removePatch);
};
