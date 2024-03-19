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
): {
  pathname: string;
  hostname: string;
  protocol: string;
  search: string;
  port: string;
} => {
  if (isURL(url)) {
    const { pathname, hostname, protocol, search, port } = url;
    return { pathname, hostname, protocol, search, port };
  }
  return getPathAndHost(new URL(url));
};

function monkeyPatchHistory(history: History, saveEvent: SaveEvent) {
  const pushState = history.pushState;
  history.pushState = function (state, unused, url) {
    if (url) {
      try {
        const components = getPathAndHost(url);
        saveEvent({ ...getBaseEvent(), ...components });
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
        const components = getPathAndHost(url);
        saveEvent({ ...getBaseEvent(), ...components });
      } catch (e) {
        saveEvent(createErrorEvent("navigation", e as any));
      }
    }
    return replaceState.apply(history, arguments as any);
  };

  // listen to popstate for back, forward and go (async)
  const listener: EventListener = (event) => {
    try {
      const components = getPathAndHost(new URL(window.location.href));
      saveEvent({ ...getBaseEvent(), ...components });
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
  const components = getPathAndHost(new URL(window.location.href));
  saveEvent({
    ...getBaseEvent(),
    ...components,
  });
};
