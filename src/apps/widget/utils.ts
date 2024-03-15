import {
  ClickEvent,
  ParsedEvent,
  RequestEvent,
  ResponseEvent,
  UserEvent,
} from "../../plugin/types";

export function isUserEvent(event: ParsedEvent): event is UserEvent {
  return (event as UserEvent).target !== undefined;
}

export function isClickEvent(event: ParsedEvent): event is ClickEvent {
  return (event as ClickEvent).clientX !== undefined;
}

export function isRequestOrResponseEvent(
  event: ParsedEvent
): event is RequestEvent | ResponseEvent {
  return (event as RequestEvent | ResponseEvent).url !== undefined;
}
