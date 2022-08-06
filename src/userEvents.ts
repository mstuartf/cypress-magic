// Listens for user events (e.g. click, scroll, etc)

import { EventType, ParsedEvent } from "./types";
import { finder } from "@medv/finder";
import { obfuscate } from "./obfuscate";

function parseEvent(event: Event): ParsedEvent {
  let selector: string;
  const target = event.target as Element;
  // todo: support multiple selectors (nested array?)
  if (target.hasAttribute("data-cy")) {
    selector = `[data-cy=${target.getAttribute("data-cy")}]`;
  } else {
    selector = finder(target);
  }
  let value = (event.target as HTMLInputElement).value;
  if (typeof value === "string") {
    value = obfuscate(value) as string;
  }
  const parsedEvent: ParsedEvent = {
    timestamp: Date.now(),
    selectors: [[selector]],
    type: event.type,
    tag: target.tagName,
    value,
    classList: target.classList,
  };
  if ((target as HTMLAnchorElement).hasAttribute("href")) {
    parsedEvent.href = (target as HTMLAnchorElement).href;
  }
  if (target.hasAttribute("id")) {
    parsedEvent.id = target.id;
  }
  if (parsedEvent.tag === "INPUT") {
    parsedEvent.inputType = (target as HTMLInputElement).type;
  }
  if (event.type === "keydown") {
    parsedEvent.key = (event as KeyboardEvent).key;
    parsedEvent.type = "keyDown";
  }
  if (event.type === "keyup") {
    parsedEvent.type = "keyUp";
  }
  if (event.type === "click") {
    parsedEvent.offsetX = (event as PointerEvent).pageX;
    parsedEvent.offsetY = (event as PointerEvent).pageY;
  }
  parsedEvent.innerText = (target as HTMLDivElement).innerText;
  return parsedEvent;
}

function handleEvent(event: Event, saveEvent: (event: any) => void): void {
  if ((event.target as HTMLDivElement).innerText === "download file") {
    // todo: remove when the download button hack is removed
    return;
  }
  if (event.isTrusted === true) {
    saveEvent(parseEvent(event));
  }
}

function addDOMListeners(saveEvent: (event: any) => void): void {
  Object.values(EventType).forEach((event) => {
    document.addEventListener(event, (event) => handleEvent(event, saveEvent), {
      capture: true,
      passive: true,
    });
  });
}

export function initializeUserEvents(saveEvent: (event: any) => void): void {
  addDOMListeners(saveEvent);
}
