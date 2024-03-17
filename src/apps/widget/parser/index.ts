import { ParsedEvent } from "../../../plugin/types";
import { getElementCy } from "./getElementCy";
import {
  isClickEvent,
  isNavigationEvent,
  isRequestEvent,
  isResponseEvent,
} from "../utils";

export const parse = (event: ParsedEvent): string => {
  if (isClickEvent(event)) {
    // todo: detect if right click
    return `${getElementCy(event.target.domPath)}.click();`;
  }
  if (isNavigationEvent(event)) {
    const { protocol, hostname, pathname } = event;
    return `cy.visit('${protocol}${hostname}${pathname}');`;
  }
  if (isRequestEvent(event)) {
    const { method, url, alias } = event;
    return `cy.intercept('${method}', '${url}').as('${alias}')`;
  }
  if (isResponseEvent(event)) {
    return `cy.wait('@${event.alias}')`;
  }
  return `${event.type} at ${event.timestamp}`;
};
