// Listens for user events (e.g. click, change, etc)

import {
  BaseEvent,
  ChangeEvent,
  ClickEvent,
  EventType,
  InitArgs,
  TargetEvent,
  UserEvent,
} from "../types";
import { finder } from "@medv/finder";
import { isHidden } from "../utils/isHidden";
import { getDomPath } from "../utils/getDomPath";
import { createErrorEvent } from "../utils/createErrorEvent";
import { generateEventId } from "../utils/generateEventId";
import {
  isHTMLElement,
  isElement,
} from "../../apps/widget/hooks/useNewFixedElementAdded";
import { findAllTagsWithInnerText } from "../../apps/utils";

const getBaseProps = (event: Event): BaseEvent => ({
  id: generateEventId(),
  type: event.type,
  timestamp: Date.now(),
});

export const getTargetProps = (target: HTMLElement): TargetEvent => {
  const tag = target.tagName;
  const innerText =
    target.childElementCount === 0 ? target.innerText : undefined;
  return {
    pathname: window.location.pathname,
    target: {
      selectors: [[finder(target)]],
      tag,
      isHidden: isHidden(target),
      type:
        target.tagName.toUpperCase() === "INPUT"
          ? (target as HTMLInputElement).type
          : null,
      domPath: getDomPath(target),
      innerText,
      innerTextValidAsSelector:
        !!innerText && findAllTagsWithInnerText(tag, innerText).length < 2,
      value: (target as HTMLInputElement).value || undefined,
      checked: (target as HTMLInputElement).checked || undefined,
      placeholder: (target as HTMLInputElement).placeholder || undefined,
    },
  };
};

const getFirstHTMLElement = (element: Element): HTMLElement => {
  if (isHTMLElement(element)) {
    return element;
  } else if (element.parentElement) {
    return getFirstHTMLElement(element.parentElement);
  }
  throw Error("no parent html element found");
};

// you can't programmatically click on non-html elements like SVGs, so find the
// first html element parent here
const getTargetHTMLElement = (target: EventTarget | null): HTMLElement => {
  if (target instanceof Element) {
    return getFirstHTMLElement(target);
  } else {
    throw Error("can't parse non-elements");
  }
};

const parseClickEvent = (event: MouseEvent): ClickEvent => ({
  ...getBaseProps(event),
  ...getTargetProps(getTargetHTMLElement(event.target)),
  clientX: event.x,
  clientY: event.y,
  href: (event.target as HTMLAnchorElement).href,
});

const parseChangeEvent = (event: Event): ChangeEvent => {
  const { value } = event.target as HTMLInputElement;
  return {
    ...getBaseProps(event),
    ...getTargetProps(event.target as HTMLElement),
    value,
  };
};

const parseEvent = (
  event: Event,
  { saveFixture }: Omit<InitArgs, "saveEvent">
): UserEvent | Promise<UserEvent> | undefined => {
  if (event.type === "click" || event.type === "dblclick") {
    return parseClickEvent(event as MouseEvent);
  } else if (event.type === "change") {
    return parseChangeEvent(event);
  }
};

function handleEvent(event: Event, { saveEvent, ...rest }: InitArgs): void {
  if (!event.isTrusted) {
    return;
  }
  if (isClickOnChangeElement(event)) {
    return;
  }
  try {
    Promise.resolve(parseEvent(event, { ...rest }))
      .then((res) => {
        if (res) {
          saveEvent(res);
        }
      })
      .catch((e) => {
        saveEvent(createErrorEvent(event.type, e));
      });
  } catch (e) {
    saveEvent(createErrorEvent(event.type, e as any));
  }
}

const isClickOnChangeElement = (event: Event) => {
  if (event.type !== "click") {
    return false;
  }
  const element = (event as MouseEvent).target;
  if (!(element instanceof Element) || !isHTMLElement(element)) {
    return false;
  }
  if (element.tagName.toUpperCase() === "SELECT") {
    return true;
  }
  if (
    element.tagName.toUpperCase() === "INPUT" &&
    ["checkbox", "radio"].includes((element as HTMLInputElement).type)
  ) {
    return true;
  }
  return false;
};

function addDOMListeners(args: InitArgs) {
  const listener: EventListener = (event) => handleEvent(event, args);
  Object.values(EventType).forEach((event) => {
    document.addEventListener(event, listener, {
      capture: true,
      passive: true,
    });
  });
  return () => {
    Object.values(EventType).forEach((event) => {
      document.removeEventListener(event, listener, { capture: true });
    });
  };
}

export function initUserObserver(args: InitArgs): void {
  addDOMListeners(args);
}
