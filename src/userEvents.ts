// Listens for user events (e.g. click, scroll, etc)

import {
  BaseEvent,
  ChangeEvent,
  ClickEvent,
  EventType,
  UserEvent,
  SubmitEvent,
  TargetEvent,
  InitArgs,
} from "./types";
import { finder } from "@medv/finder";

const getBaseProps = (event: Event): BaseEvent => ({
  type: event.type,
  timestamp: Date.now(),
});

const getTargetProps = (
  target: Element
): Omit<TargetEvent, "type" | "timestamp" | "domain"> => ({
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

const parseClickEvent = (
  event: MouseEvent,
  removeStateData: InitArgs["removeStateData"]
): ClickEvent => ({
  ...getBaseProps(event),
  ...getTargetProps(event.target as Element),
  offsetX: event.pageX,
  offsetY: event.pageY,
  innerText: removeStateData((event.target as HTMLDivElement).innerText),
  href: (event.target as HTMLAnchorElement).href,
});

const parseChangeEvent = (
  event: Event,
  obfuscate: InitArgs["obfuscate"]
): ChangeEvent => {
  const { type, value } = event.target as HTMLInputElement;
  return {
    ...getBaseProps(event),
    ...getTargetProps(event.target as Element),
    inputType: type,
    value: typeof value === "string" ? obfuscate(value) : value,
  };
};

const parseSubmitEvent = (event: Event): SubmitEvent => ({
  ...getBaseProps(event),
  ...getTargetProps(event.target as Element),
});

const parseEvent = (
  event: Event,
  { obfuscate, removeStateData }: ObsArgs
): UserEvent => {
  if (event.type === "click" || event.type === "dblclick") {
    return parseClickEvent(event as MouseEvent, removeStateData);
  } else if (event.type === "change") {
    return parseChangeEvent(event, obfuscate);
  } else if (event.type === "submit") {
    return parseSubmitEvent(event);
  }
};

type ObsArgs = Pick<InitArgs, "obfuscate" | "removeStateData">;

function handleEvent(event: Event, { saveEvent, ...rest }: InitArgs): void {
  if ((event.target as HTMLDivElement).innerText === "download file") {
    // todo: remove when the download button hack is removed
    return;
  }
  if (event.isTrusted === true) {
    saveEvent(parseEvent(event, { ...rest }));
  }
}

function addDOMListeners(args: InitArgs): void {
  Object.values(EventType).forEach((event) => {
    document.addEventListener(event, (event) => handleEvent(event, args), {
      capture: true,
      passive: true,
    });
  });
}

export function initializeUserEvents(args: InitArgs): void {
  addDOMListeners(args);
}
