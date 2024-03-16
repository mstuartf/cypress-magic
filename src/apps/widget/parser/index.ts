import { ParsedEvent } from "../../../plugin/types";
import { getElementCy } from "./getElementCy";
import { isClickEvent } from "../utils";

export const parse = (event: ParsedEvent): string => {
  if (isClickEvent(event)) {
    // todo: detect if right click
    return `${getElementCy(event.target.domPath)}.click();`;
  }
  return `${event.type} at ${event.timestamp}`;
};
