import { ParsedEvent } from "../../../plugin/types";
import {
  isAssertionEvent,
  isClickEvent,
  isNavigationEvent,
  isRequestEvent,
  isResponseEvent,
  isPageRefreshEvent,
  isUrlChangeEvent,
  isChangeEvent,
  isQueryParamChangeEvent,
  isDblClickEvent,
  buildFullUrl,
} from "../utils";
import { extractInnerText, parseSelector } from "./parseSelector";

interface ParseOptions {
  mockNetworkRequests: boolean;
  nestedFixtureFolder: string;
}

export const parse = (
  event: ParsedEvent,
  { mockNetworkRequests, nestedFixtureFolder }: ParseOptions
): string => {
  if (isClickEvent(event)) {
    // todo: detect if right click
    return `${getElement(parseSelector(event.target))}.click();`;
  }
  if (isDblClickEvent(event)) {
    return `${getElement(parseSelector(event.target))}.dblclick();`;
  }
  if (isChangeEvent(event)) {
    if (event.target.tag === "SELECT") {
      return `${getElement(parseSelector(event.target))}.select('${
        event.value
      }');`;
    } else if (event.target.tag === "INPUT" && event.target.type === "radio") {
      return `${getElement(parseSelector(event.target))}.check();`;
    } else if (
      event.target.tag === "INPUT" &&
      event.target.type === "checkbox"
    ) {
      return `${getElement(parseSelector(event.target))}.${
        event.target.checked ? "check" : "uncheck"
      }();`;
    } else {
      return `${getElement(parseSelector(event.target))}.clear().type('${
        event.value
      }');`;
    }
  }
  if (isNavigationEvent(event)) {
    return `cy.visit('${buildFullUrl(event)}');`;
  }
  if (isQueryParamChangeEvent(event)) {
    const { param, added, removed, changed } = event;
    if (added) {
      return `cy.url().should('include', '${param}=${added}')`;
    }
    if (changed) {
      return `cy.url().should('include', '${param}=${changed}')`;
    }
    return `cy.url().should('not.include', '${param}=${removed}')`;
  }
  if (isPageRefreshEvent(event)) {
    return `cy.reload();`;
  }
  if (isUrlChangeEvent(event)) {
    return `cy.url().should('include', '${event.urlDiff}')`;
  }
  if (isRequestEvent(event)) {
    const { method, url, alias, fixture, status } = event;
    if (mockNetworkRequests) {
      const body =
        status === 204
          ? `body: null`
          : `fixture: '${nestedFixtureFolder}/${fixture}'`;
      return `cy.intercept('${method}', '${url}', { statusCode: ${
        status || "..."
      }, ${body} }).as('${alias}')`;
    } else {
      return `cy.intercept('${method}', '${url}').as('${alias}')`;
    }
  }
  if (isResponseEvent(event)) {
    return `cy.wait('@${event.alias}')`;
  }
  if (isAssertionEvent(event)) {
    const {
      target: { innerText },
    } = event;
    const assertion = innerText
      ? `should('contain', '${innerText}')`
      : `should('exist')`;
    return `${getElement(
      parseSelector(event.target, { ignoreInnerText: !!innerText })
    )}.${assertion};`;
  }
  throw Error(`UNSUPPORTED: ${event.type} at ${event.timestamp}`);
};

const getElement = (selector: string): string => {
  if (selector.includes("contains")) {
    const [tag, innerText] = extractInnerText(selector);
    return `cy.get('${tag}').contains('${innerText}')`;
  }
  return `cy.get('${selector}')`;
};
