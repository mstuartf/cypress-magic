// Listens for user events (e.g. click, scroll, etc)

import {
  BaseEvent,
  ChangeEvent,
  ClickEvent,
  EventType,
  UserEvent,
  SaveEvent,
  SubmitEvent,
  TargetEvent,
} from "./types";
import { finder } from "@medv/finder";
import { obfuscate } from "./obfuscate";

const getBaseProps: (event: Event) => BaseEvent = (event) => ({
  type: event.type,
  timestamp: Date.now(),
});

const getTargetProps: (
  target: Element
) => Omit<TargetEvent, "type" | "timestamp" | "domain"> = (target) => ({
  selectors: [
    [
      target.hasAttribute("data-cy")
        ? `[data-cy=${target.getAttribute("data-cy")}]`
        : finder(target),
    ],
  ],
  tag: target.tagName,
  classList: target.classList,
  id: target.id,
});

const parseClickEvent: (event: MouseEvent) => ClickEvent = (event) => ({
  ...getBaseProps(event),
  ...getTargetProps(event.target as Element),
  offsetX: event.pageX,
  offsetY: event.pageY,
  innerText: (event.target as HTMLDivElement).innerText,
  href: (event.target as HTMLAnchorElement).href,
});

const parseChangeEvent: (event: Event) => ChangeEvent = (event) => {
  const { type, value } = event.target as HTMLInputElement;
  return {
    ...getBaseProps(event),
    ...getTargetProps(event.target as Element),
    inputType: type,
    value: typeof value === "string" ? obfuscate(value) : value,
  };
};

const parseSubmitEvent: (event: Event) => SubmitEvent = (event) => ({
  ...getBaseProps(event),
  ...getTargetProps(event.target as Element),
});

const parseEvent: (event: Event) => UserEvent = (event) => {
  if (event.type === "click" || event.type === "dblclick") {
    return parseClickEvent(event as MouseEvent);
  } else if (event.type === "change") {
    return parseChangeEvent(event);
  } else if (event.type === "submit") {
    return parseSubmitEvent(event);
  }
};

function handleEvent(event: Event, saveEvent: SaveEvent): void {
  if ((event.target as HTMLDivElement).innerText === "download file") {
    // todo: remove when the download button hack is removed
    return;
  }
  if (event.isTrusted === true) {
    saveEvent(parseEvent(event));
  }
}

function addDOMListeners(saveEvent: SaveEvent): void {
  Object.values(EventType).forEach((event) => {
    document.addEventListener(event, (event) => handleEvent(event, saveEvent), {
      capture: true,
      passive: true,
    });
  });
}

export function initializeUserEvents(saveEvent: SaveEvent): void {
  addDOMListeners(saveEvent);
}
