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

const getBaseProps = (event: Event): BaseEvent => ({
  type: event.type,
  timestamp: Date.now(),
});

const getTargetProps = (
  target: Element
): Omit<TargetEvent, "type" | "timestamp" | "domain"> => ({
  selectors: [[finder(target)]],
  dataCy: target.getAttribute("data-cy"),
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

const parseCSVUploadEvent = (
  event: Event,
  obfuscate: InitArgs["obfuscate"]
): Promise<UploadEvent> => {
  return new Promise(function (complete, error) {
    const file = (event.target as HTMLInputElement).files[0];
    Papa.parse<string[]>(file, {
      complete: ({ data }) => {
        const [headers, ...rows] = data;
        complete({
          type: "fileUpload",
          timestamp: Date.now(),
          ...getTargetProps(event.target as Element),
          data: [
            headers,
            ...rows.map((row) => row.map((col) => obfuscate(col))),
          ],
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
  ...getTargetProps(event.target as Element),
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
    ...getTargetProps(event.target as Element),
  },
  destination: {
    clientX: event.clientX,
    clientY: event.clientY,
  },
  type: "dragDrop",
});

const parseEvent = (
  event: Event,
  { obfuscate, removeStateData }: ObsArgs
): UserEvent | Promise<UserEvent> => {
  if (event.type === "click" || event.type === "dblclick") {
    return parseClickEvent(event as MouseEvent, removeStateData);
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

type ObsArgs = Pick<InitArgs, "obfuscate" | "removeStateData">;

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
