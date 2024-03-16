import { ParsedEvent } from "../../../plugin/types";
import { getElementCy } from "./getElementCy";
import {
  isClickEvent,
  isNavigationOrUrlChangeEvent,
  isRequestEvent,
  isResponseEvent,
} from "../utils";

export const parse = (event: ParsedEvent): string => {
  if (isClickEvent(event)) {
    // todo: detect if right click
    return `${getElementCy(event.target.domPath)}.click();`;
  }
  if (isNavigationOrUrlChangeEvent(event) && event.type === "navigation") {
    const { protocol, hostname, pathname } = event;
    return `cy.visit('${protocol}${hostname}${pathname}');`;
  }
  if (isRequestEvent(event)) {
    const alias = "__alias__"; // todo
    const { method, url } = event;
    return `cy.intercept('${method}', '${url}').as('${alias}')`;
  }
  if (isResponseEvent(event)) {
    const alias = "__alias__"; // todo
    return `cy.wait('@${alias}')`;
  }
  return `${event.type} at ${event.timestamp}`;
};
