import { ParsedEvent } from "../../../plugin/types";
import { getElementCy } from "./getElementCy";
import {
  isAssertionEvent,
  isClickEvent,
  isNavigationEvent,
  isRequestEvent,
  isResponseEvent,
  isPageRefreshEvent,
  isUrlChangeEvent,
  isChangeEvent,
} from "../utils";

export const parse = (event: ParsedEvent): string => {
  if (isClickEvent(event)) {
    // todo: detect if right click
    return `${getElementCy(event.target.domPath)}.click();`;
  }
  if (isChangeEvent(event)) {
    if (event.target.tag === "SELECT") {
      return `${getElementCy(event.target.domPath)}.select('${event.value}');`;
    } else if (event.target.tag === "INPUT" && event.target.type === "radio") {
      return `${getElementCy(event.target.domPath)}.check();`;
    } else {
      return `${getElementCy(event.target.domPath)}.clear().type('${
        event.value
      }');`;
    }
  }
  if (isNavigationEvent(event)) {
    const { protocol, hostname, pathname, port } = event;
    return `cy.visit('${protocol}//${hostname}${
      port.length ? `:${port}` : ""
    }${pathname}');`;
  }
  if (isPageRefreshEvent(event)) {
    return `cy.reload();`;
  }
  if (isUrlChangeEvent(event)) {
    return `cy.url().should('include', '${event.urlDiff}')`;
  }
  if (isRequestEvent(event)) {
    const { method, url, alias } = event;
    return `cy.intercept('${method}', '${url}').as('${alias}')`;
  }
  if (isResponseEvent(event)) {
    return `cy.wait('@${event.alias}')`;
  }
  if (isAssertionEvent(event)) {
    const {
      target: { innerText, domPath },
    } = event;
    const assertion = innerText
      ? `contains('${innerText}')`
      : `should('exist')`;
    return `${getElementCy(domPath)}.${assertion};`;
  }
  return `${event.type} at ${event.timestamp}`;
};
