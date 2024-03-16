import { ParsedEvent } from "../../plugin/types";

export const sideBarWith = 362;
export const widgetId = "__widget__";

export const getEventId = (event: ParsedEvent) =>
  `${event.type}-${event.timestamp}`;
