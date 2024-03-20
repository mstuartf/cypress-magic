import {
  AssertionEvent,
  ChangeEvent,
  ClickEvent,
  DblClickEvent,
  NavigationEvent,
  PageRefreshEvent,
  ParsedEvent,
  QueryParamChangeEvent,
  RequestEvent,
  ResponseEvent,
  UrlChangeEvent,
  UserEvent,
} from "../../plugin/types";

export function isUserEvent(event: ParsedEvent): event is UserEvent {
  return (event as UserEvent).target !== undefined;
}

export function isClickEvent(event: ParsedEvent): event is ClickEvent {
  return (event as ClickEvent).type === "click";
}

export function isDblClickEvent(event: ParsedEvent): event is DblClickEvent {
  return (event as DblClickEvent).type === "dblclick";
}

export function isChangeEvent(event: ParsedEvent): event is ChangeEvent {
  return (event as ChangeEvent).type === "change";
}

export function isAssertionEvent(event: ParsedEvent): event is AssertionEvent {
  return (event as AssertionEvent).type === "assertion";
}

export function isRequestOrResponseEvent(
  event: ParsedEvent
): event is RequestEvent | ResponseEvent {
  return (event as RequestEvent | ResponseEvent).url !== undefined;
}

export function isRequestEvent(event: ParsedEvent): event is RequestEvent {
  return (event as RequestEvent).type === "request";
}

export function isResponseEvent(event: ParsedEvent): event is ResponseEvent {
  return (event as ResponseEvent).type === "response";
}

export function isNavigationEvent(
  event: ParsedEvent
): event is NavigationEvent {
  return (event as NavigationEvent).type === "navigation";
}

export function isUrlChangeEvent(event: ParsedEvent): event is UrlChangeEvent {
  return (event as UrlChangeEvent).type === "urlChange";
}

export function isQueryParamChangeEvent(
  event: ParsedEvent
): event is QueryParamChangeEvent {
  return (event as QueryParamChangeEvent).type === "queryParamChange";
}

export function isPageRefreshEvent(
  event: ParsedEvent
): event is PageRefreshEvent {
  return (event as PageRefreshEvent).type === "refresh";
}

export const getUrlDiff = (
  event: NavigationEvent,
  lastEvent: NavigationEvent
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
  event: NavigationEvent,
  lastEvent: NavigationEvent
): Pick<QueryParamChangeEvent, "param" | "added" | "removed" | "changed">[] => {
  return getRemovedParamsSearchString(
    new URLSearchParams(event.search),
    new URLSearchParams(lastEvent.search)
  );
};

export const isRequestTriggerEvent = (event: ParsedEvent) =>
  isUserEvent(event) || isNavigationEvent(event);
