// Listens for navigation events

import { BaseEvent, InitArgs, SaveEvent } from "../types";
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
): { pathname: string; hostname: string; protocol: string } => {
  if (isURL(url)) {
    return url;
  }
  return {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    pathname: url,
  };
};

function monkeyPatchHistory(history: History, saveEvent: SaveEvent) {
  const pushState = history.pushState;
  history.pushState = function (state, unused, url) {
    if (url) {
      try {
        const { pathname, hostname, protocol } = getPathAndHost(url);
        saveEvent({ ...getBaseEvent(), pathname, hostname, protocol });
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
        const { pathname, hostname, protocol } = getPathAndHost(url);
        saveEvent({ ...getBaseEvent(), pathname, hostname, protocol });
      } catch (e) {
        saveEvent(createErrorEvent("navigation", e as any));
      }
    }
    return replaceState.apply(history, arguments as any);
  };

  // listen to popstate for back, forward and go (async)
  const listener: EventListener = (event) => {
    try {
      const { hostname, pathname, protocol } = window.location;
      saveEvent({ ...getBaseEvent(), pathname, hostname, protocol });
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

export const initHistoryObserver = ({ saveEvent }: InitArgs) => {
  monkeyPatchHistory(window.history, saveEvent);
  const { pathname, hostname, protocol } = new URL(window.location.href);
  saveEvent({
    ...getBaseEvent(),
    pathname,
    hostname,
    protocol,
  });
};
