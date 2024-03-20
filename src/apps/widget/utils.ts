import {
  AssertionEvent,
  ChangeEvent,
  ClickEvent,
  DblClickEvent,
  HistoryEvent,
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

export function isHistoryEvent(event: ParsedEvent): event is HistoryEvent {
  return (event as HistoryEvent).type === "history";
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

export const isRequestTriggerEvent = (event: ParsedEvent) =>
  isUserEvent(event) || isHistoryEvent(event);
