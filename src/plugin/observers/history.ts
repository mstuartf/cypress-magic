// Listens for navigation events

import {
  BaseEvent,
  InitArgs,
  QueryParamChangeEvent,
  SaveEvent,
  UrlChangeEvent,
} from "../types";
import { createErrorEvent } from "../utils/createErrorEvent";
import { generateEventId } from "../utils/generateEventId";

const getBaseEvent = (): Omit<BaseEvent, "type"> => ({
  id: generateEventId(),
  timestamp: Date.now() + 1, // move after trigger
});

function isURL(url: string | URL): url is URL {
  return (url as URL).pathname !== undefined;
}

const isAbsoluteUrl = (url: string) => {
  const r = new RegExp("^(?:[a-z+]+:)?//", "i");
  return r.test(url);
};

const toURL = (url: string) => {
  const input = isAbsoluteUrl(url) ? url : `${window.location.href}${url}`;
  return new URL(input);
};

export const getUrlDiff = (
  event: Components,
  lastEvent: Components
): string | undefined => {
  if (
    event.protocol !== lastEvent.protocol ||
    event.hostname !== lastEvent.hostname
  ) {
    return `${event.protocol}//${event.hostname}${event.pathname}${event.search}`;
  }
  if (event.pathname != lastEvent.pathname) {
    return `${event.pathname}${event.search}`;
  }
  return undefined;
};

function getRemovedParamsSearchString(
  updatedSearchParams: URLSearchParams,
  originalSearchParams: URLSearchParams
) {
  const diffs: Pick<
    QueryParamChangeEvent,
    "param" | "added" | "removed" | "changed"
  >[] = [];

  originalSearchParams.forEach((value, param) => {
    if (!updatedSearchParams.has(param)) {
      diffs.push({ param, removed: value });
    } else if (
      updatedSearchParams.get(param) != originalSearchParams.get(param)
    ) {
      diffs.push({ param, changed: value });
    }
  });

  updatedSearchParams.forEach((value, param) => {
    if (!originalSearchParams.has(param)) {
      diffs.push({ param, added: value });
    }
  });

  return diffs;
}

export const getSearchDiff = (
  event: Components,
  lastEvent: Components
): Pick<QueryParamChangeEvent, "param" | "added" | "removed" | "changed">[] => {
  return getRemovedParamsSearchString(
    new URLSearchParams(event.search),
    new URLSearchParams(lastEvent.search)
  );
};

interface Components {
  pathname: string;
  hostname: string;
  protocol: string;
  search: string;
  port: string;
}

export const getPathAndHost = (url: URL): Components => {
  const { pathname, hostname, protocol, search, port } = url;
  return { pathname, hostname, protocol, search, port };
};

const handleStateChange = (oldUrl: URL, newUrl: URL, saveEvent: SaveEvent) => {
  try {
    const oldState = getPathAndHost(oldUrl);
    const newState = getPathAndHost(newUrl);
    const urlDiff = getUrlDiff(newState, oldState);
    const searchDiff = getSearchDiff(newState, oldState);
    if (!!urlDiff) {
      const event: UrlChangeEvent = {
        ...getBaseEvent(),
        ...newState,
        type: "urlChange",
        urlDiff,
      };
      saveEvent(event);
    } else if (!!searchDiff.length) {
      searchDiff.forEach(({ param, added, removed, changed }) => {
        const event: QueryParamChangeEvent = {
          ...getBaseEvent(),
          ...newState,
          type: "queryParamChange",
          param,
          added,
          removed,
          changed,
        };
        saveEvent(event);
      });
    }
  } catch (e) {
    saveEvent(createErrorEvent("navigation", e as any));
  }
};

function monkeyPatchHistory(history: History, saveEvent: SaveEvent) {
  const states: URL[] = [toURL(window.location.href)];

  const onStateChange = (url: string | URL) => {
    const prevUrl = states[states.length - 1];
    const newUrl = isURL(url) ? url : toURL(url);
    handleStateChange(prevUrl, newUrl, saveEvent);
    states.push(newUrl);
  };

  const pushState = history.pushState;
  history.pushState = function (state, unused, url) {
    if (url) {
      onStateChange(url);
    }
    return pushState.apply(history, arguments as any);
  };

  const replaceState = history.replaceState;
  history.replaceState = function (state, unused, url) {
    if (url) {
      onStateChange(url);
    }
    return replaceState.apply(history, arguments as any);
  };

  // listen to popstate for back, forward and go (async)
  // const listener: EventListener = (event) => {
  //   try {
  //     const components = getPathAndHost(toURL(window.location.href));
  //     saveEvent({ ...getBaseEvent(), ...components });
  //   } catch (e) {
  //     saveEvent(createErrorEvent("navigation", e as any));
  //   }
  // };
  // window.addEventListener("popstate", listener);

  return () => {
    history.pushState = pushState;
    history.replaceState = replaceState;
    // window.removeEventListener("popstate", listener);
  };
}

export const initHistoryObserver = ({ saveEvent }: InitArgs) => {
  monkeyPatchHistory(window.history, saveEvent);
};
