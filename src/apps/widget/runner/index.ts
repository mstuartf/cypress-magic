import { ParsedEvent } from "../../../plugin/types";
import {
  buildFullUrl,
  isAssertionEvent,
  isChangeEvent,
  isClickEvent,
  isNavigationEvent,
  isPageRefreshEvent,
  isQueryParamChangeEvent,
} from "../utils";
import { get } from "./get";
import { parseSelector } from "../parser/parseSelector";

export interface RunOptions {
  mockNetworkRequests: boolean;
}

const interval = 10;
export const timeout = 4000;

export const runAsync = (
  event: ParsedEvent,
  options: RunOptions
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      try {
        run(event, options);
        clearInterval(intervalId);
        resolve();
      } catch (e: any) {
        if (Date.now() - startTime > timeout) {
          clearInterval(intervalId);
          reject(e);
        }
      }
    }, interval);
  });
};

const run = (event: ParsedEvent, { mockNetworkRequests }: RunOptions) => {
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
    window.location.href = buildFullUrl(event);
    return;
  }
  if (isQueryParamChangeEvent(event)) {
    const { param, added, removed, changed } = event;

    if (added) {
      if (!window.location.search.includes(`${param}=${added}`)) {
        throw Error(
          `Timed out retrying after ${timeout}ms: expected '${buildFullUrl(
            event
          )}' to include '${param}=${added}'`
        );
      }
    }
    if (changed) {
      if (!window.location.search.includes(`${param}=${changed}`)) {
        throw Error(
          `Timed out retrying after ${timeout}ms: expected '${buildFullUrl(
            event
          )}' to include '${param}=${changed}'`
        );
      }
    }
    if (window.location.search.includes(`${param}=${removed}`)) {
      throw Error(
        `Timed out retrying after ${timeout}ms: expected '${buildFullUrl(
          event
        )}' not to include '${param}=${removed}'`
      );
    }
  }
  if (isPageRefreshEvent(event)) {
    return window.location.reload();
  }
  // if (isUrlChangeEvent(event)) {
  //   return `cy.url().should('include', '${event.urlDiff}')`;
  // }
  if (isAssertionEvent(event)) {
    const {
      target: { innerText, domPath },
    } = event;
    const el = get(domPath);
    if (!!innerText && !el.innerText.includes(innerText)) {
      throw Error(
        `Timed out retrying after ${timeout}ms: expected '${parseSelector(
          domPath
        )}' to contain '${innerText}'`
      );
    }
  }
};
