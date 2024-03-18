import {
  AssertionEvent,
  ClickEvent,
  NavigationEvent,
  ParsedEvent,
  RequestEvent,
  ResponseEvent,
  UserEvent,
} from "../../plugin/types";

export function isUserEvent(event: ParsedEvent): event is UserEvent {
  return (event as UserEvent).target !== undefined;
}

export function isClickEvent(event: ParsedEvent): event is ClickEvent {
  return (event as ClickEvent).type === "click";
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
