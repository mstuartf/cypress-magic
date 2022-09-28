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
  UploadEvent,
  DragDropEvent,
} from "../types";
import { finder } from "@medv/finder";
import * as Papa from "papaparse";
import { isHidden } from "../utils/isHidden";
import { getDomPath } from "../utils/getDomPath";

const getBaseProps = (event: Event): BaseEvent => ({
  type: event.type,
  timestamp: Date.now(),
});

const getTargetProps = (
  target: HTMLElement
): Omit<TargetEvent, "type" | "timestamp" | "domain"> => ({
  selectors: [[finder(target)]],
  dataCy: target.dataset.cy,
  dataTestid: target.dataset.testid,
  tag: target.tagName,
  classList: target.classList,
  id: target.id,
  isHidden: isHidden(target),
  targetType: (target as HTMLInputElement).type,
  domPath: getDomPath(target),
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

const parseCSVUploadEvent = (
  event: Event,
  obfuscate: InitArgs["obfuscate"]
): Promise<UploadEvent> => {
  return new Promise(function (complete, error) {
    const file = (event.target as HTMLInputElement).files[0];
    Papa.parse<string[]>(file, {
      complete: ({ data }) => {
        complete({
          type: "fileUpload",
          timestamp: Date.now(),
          ...getTargetProps(event.target as HTMLElement),
          data: data.map((row) => row.map((col) => obfuscate(col))),
          mimeType: file.type,
          fileName: file.name,
        });
      },
      error,
    });
  });
};

const parseSubmitEvent = (event: Event): SubmitEvent => ({
  ...getBaseProps(event),
  ...getTargetProps(event.target as HTMLElement),
});

const isCSVFileUpload = (
  target: Event["target"]
): target is HTMLInputElement => {
  return (
    target &&
    target instanceof HTMLInputElement &&
    target.type === "file" &&
    !!target.files[0] &&
    target.files[0].type === "text/csv"
  );
};

const parseDragDropEvent = (event: MouseEvent): DragDropEvent => ({
  ...getBaseProps(event),
  target: {
    ...getTargetProps(event.target as HTMLElement),
  },
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
  } else if (event.type === "change" && isCSVFileUpload(event.target)) {
    return parseCSVUploadEvent(event, obfuscate);
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
  Promise.resolve(parseEvent(event, { ...rest })).then((res) => saveEvent(res));
}

function addDOMListeners(args: InitArgs): void {
  Object.values(EventType).forEach((event) => {
    document.addEventListener(event, (event) => handleEvent(event, args), {
      capture: true,
      passive: true,
    });
  });
}

export function initUserObserver(args: InitArgs): void {
  addDOMListeners(args);
}
