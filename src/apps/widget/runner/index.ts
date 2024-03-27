import { ParsedEvent } from "../../../plugin/types";
import {
  isChangeEvent,
  isClickEvent,
  isNavigationEvent,
  isPageRefreshEvent,
  isQueryParamChangeEvent,
} from "../utils";
import { get } from "./get";

export interface RunOptions {
  mockNetworkRequests: boolean;
}

export const run = (
  event: ParsedEvent,
  { mockNetworkRequests }: RunOptions
) => {
  if (isClickEvent(event)) {
    // todo: detect if right click
    get(event.target.domPath).click();
    return;
  }
  // if (isDblClickEvent(event)) {
  //   return `${getElementCy(event.target.domPath)}.dblclick();`;
  // }
  if (isChangeEvent(event)) {
    if (event.target.tag === "SELECT") {
      //     return `${getElementCy(event.target.domPath)}.select('${event.value}');`;
    } else if (event.target.tag === "INPUT" && event.target.type === "radio") {
      //     return `${getElementCy(event.target.domPath)}.check();`;
    } else {
      get<HTMLInputElement>(event.target.domPath).value = event.value;
    }
  }
  if (isNavigationEvent(event)) {
    const { protocol, hostname, pathname, port, search } = event;
    window.location.href = `${protocol}//${hostname}${
      port.length ? `:${port}` : ""
    }${pathname}${search}`;
    return;
  }
  if (isQueryParamChangeEvent(event)) {
    const { param, added, removed, changed } = event;

    if (added) {
      if (!window.location.search.includes(`${param}=${added}`)) {
        throw Error(`Param '${param}=${added}' not found.`);
      }
    }
    if (changed) {
      if (!window.location.search.includes(`${param}=${added}`)) {
        throw Error(`Param '${param}=${changed}' not found.`);
      }
    }
    if (window.location.search.includes(`${param}=${removed}`)) {
      throw Error(`Param '${param}=${removed}' was not removed.`);
    }
  }
  if (isPageRefreshEvent(event)) {
    return window.location.reload();
  }
  // if (isUrlChangeEvent(event)) {
  //   return `cy.url().should('include', '${event.urlDiff}')`;
  // }
  // if (isRequestEvent(event)) {
  //   const { method, url, alias, fixture, status } = event;
  //   if (mockNetworkRequests) {
  //     return `cy.intercept('${method}', '${url}', {statusCode: ${
  //       status || "..."
  //     }, fixture: '${nestedFixtureFolder}/${
  //       fixture || "..."
  //     }'}).as('${alias}')`;
  //   } else {
  //     return `cy.intercept('${method}', '${url}').as('${alias}')`;
  //   }
  // }
  // if (isAssertionEvent(event)) {
  //   const {
  //     target: { innerText, domPath },
  //   } = event;
  //   const assertion = innerText
  //     ? `contains('${innerText}')`
  //     : `should('exist')`;
  //   return `${getElementCy(domPath)}.${assertion};`;
  // }
};
