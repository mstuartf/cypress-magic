import { ParsedEvent } from "../../../plugin/types";
import { getElementCy } from "./getElementCy";
import { isClickEvent, isNavigationOrUrlChangeEvent } from "../utils";

export const parse = (event: ParsedEvent): string => {
  if (isClickEvent(event)) {
    // todo: detect if right click
    return `${getElementCy(event.target.domPath)}.click();`;
  }
  if (isNavigationOrUrlChangeEvent(event) && event.type === "navigation") {
    const { protocol, hostname, pathname } = event;
    return `cy.visit(\`${protocol}${hostname}${pathname}\`);`;
  }
  return `${event.type} at ${event.timestamp}`;
};
