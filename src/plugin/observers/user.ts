// Listens for user events (e.g. click, scroll, etc)

import {
  BaseEvent,
  ChangeEvent,
  ClickEvent,
  DragDropEvent,
  EventType,
  InitArgs,
  OnCloseCallback,
  SaveFixture,
  SubmitEvent,
  TargetEvent,
  UploadEvent,
  UserEvent,
} from "../types";
import { finder } from "@medv/finder";
import { isHidden } from "../utils/isHidden";
import { getDomPath } from "../utils/getDomPath";
import { createErrorEvent } from "../utils/createErrorEvent";

const getBaseProps = (event: Event): BaseEvent => ({
  type: event.type,
  timestamp: Date.now(),
});

const getTargetProps = (target: HTMLElement): TargetEvent => ({
  pathname: window.location.pathname,
  target: {
    selectors: [[finder(target)]],
    tag: target.tagName,
    isHidden: isHidden(target),
    type: (target as HTMLInputElement).type,
    domPath: getDomPath(target),
  },
});

const parseClickEvent = (event: MouseEvent): ClickEvent => ({
  ...getBaseProps(event),
  ...getTargetProps(event.target as HTMLElement),
  offsetX: event.pageX,
  offsetY: event.pageY,
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

const parseUploadEvent = (
  event: Event,
  saveFixture: SaveFixture
): UploadEvent => {
  const file = (event.target! as HTMLInputElement)!.files![0];
  // todo: blobify
  saveFixture(file.name, file);
  return {
    type: "fileUpload",
    timestamp: Date.now(),
    ...getTargetProps(event.target as HTMLElement),
    mimeType: file.type,
    fileName: file.name,
  };
};

const parseSubmitEvent = (event: Event): SubmitEvent => ({
  ...getBaseProps(event),
  ...getTargetProps(event.target as HTMLElement),
});

const isUploadEvent = (target: Event["target"]): target is HTMLInputElement => {
  return (
    !!target &&
    target instanceof HTMLInputElement &&
    target.type === "file" &&
    !!target.files![0]
  );
};

const parseDragDropEvent = (event: MouseEvent): DragDropEvent => ({
  ...getBaseProps(event),
  ...getTargetProps(event.target as HTMLElement),
  destination: {
    clientX: event.clientX,
    clientY: event.clientY,
  },
  type: "dragDrop",
});

const parseEvent = (
  event: Event,
  { saveFixture }: Omit<InitArgs, "saveEvent">
): UserEvent | Promise<UserEvent> | undefined => {
  if (event.type === "click" || event.type === "dblclick") {
    return parseClickEvent(event as MouseEvent);
  } else if (event.type === "change" && isUploadEvent(event.target)) {
    return parseUploadEvent(event, saveFixture);
  } else if (event.type === "change") {
    return parseChangeEvent(event);
  } else if (event.type === "submit") {
    return parseSubmitEvent(event);
  } else if (event.type === "dragend") {
    return parseDragDropEvent(event as MouseEvent);
  }
};

function handleEvent(event: Event, { saveEvent, ...rest }: InitArgs): void {
  if (!event.isTrusted) {
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

function addDOMListeners(args: InitArgs): OnCloseCallback {
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

export function initUserObserver({
  registerOnCloseCallback,
  ...rest
}: InitArgs): void {
  const removeDOMListeners = addDOMListeners({
    registerOnCloseCallback,
    ...rest,
  });
  registerOnCloseCallback(removeDOMListeners);
}
