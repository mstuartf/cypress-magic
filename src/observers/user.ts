// Listens for user events (e.g. click, scroll, etc)

import {
  BaseEvent,
  ChangeEvent,
  ClickEvent,
  DragDropEvent,
  EventType,
  InitArgs,
  OnCloseCallback,
  SubmitEvent,
  TargetEvent,
  UploadEvent,
  UserEvent,
} from "../types";
import { finder } from "@medv/finder";
import { isHidden } from "../utils/isHidden";
import { getDomPath } from "../utils/getDomPath";
import { readSpreadsheet } from "../utils/readSpreadsheet";
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

const parseChangeEvent = (
  event: Event,
  obfuscate: InitArgs["obfuscate"]
): ChangeEvent => {
  const { value } = event.target as HTMLInputElement;
  return {
    ...getBaseProps(event),
    ...getTargetProps(event.target as HTMLElement),
    value: typeof value === "string" ? obfuscate(value) : value,
  };
};

const parseSpreadsheetUploadEvent = (
  event: Event,
  obfuscate: InitArgs["obfuscate"]
): Promise<UploadEvent> => {
  return new Promise((resolve, reject) => {
    const file = (event.target as HTMLInputElement).files[0];
    readSpreadsheet(file).then((data) => {
      resolve({
        type: "fileUpload",
        timestamp: Date.now(),
        ...getTargetProps(event.target as HTMLElement),
        data: data
          // only take first 10 rows
          .slice(0, 10)
          // obfuscate contents
          .map((row) => row.map((col) => obfuscate(col))),
        mimeType: file.type,
        fileName: file.name,
      });
    });
  });
};

const parseOtherUploadEvent = (event: Event): UploadEvent => {
  const file = (event.target as HTMLInputElement).files[0];
  return {
    type: "fileUpload",
    timestamp: Date.now(),
    ...getTargetProps(event.target as HTMLElement),
    data: null,
    mimeType: file.type,
    fileName: file.name,
  };
};

const parseSubmitEvent = (event: Event): SubmitEvent => ({
  ...getBaseProps(event),
  ...getTargetProps(event.target as HTMLElement),
});

const isSpreadsheetUpload = (
  target: Event["target"]
): target is HTMLInputElement => {
  return (
    target &&
    target instanceof HTMLInputElement &&
    target.type === "file" &&
    !!target.files[0] &&
    ["xlsx", "xlsb", "xlsm", "xls", "csv"].some((extension) =>
      target.files[0].name.includes(extension)
    )
  );
};

const isOtherUpload = (target: Event["target"]): target is HTMLInputElement => {
  return (
    target &&
    target instanceof HTMLInputElement &&
    target.type === "file" &&
    !!target.files[0]
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
  { obfuscate }: Pick<InitArgs, "obfuscate">
): UserEvent | Promise<UserEvent> => {
  if (event.type === "click" || event.type === "dblclick") {
    return parseClickEvent(event as MouseEvent);
  } else if (event.type === "change" && isSpreadsheetUpload(event.target)) {
    return parseSpreadsheetUploadEvent(event, obfuscate);
  } else if (event.type === "change" && isOtherUpload(event.target)) {
    return parseOtherUploadEvent(event);
  } else if (event.type === "change") {
    return parseChangeEvent(event, obfuscate);
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
      .then((res) => saveEvent(res))
      .catch((e) => {
        saveEvent(createErrorEvent(event.type, e));
      });
  } catch (e) {
    saveEvent(createErrorEvent(event.type, e));
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
