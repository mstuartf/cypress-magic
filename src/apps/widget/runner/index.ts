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
import { extractInnerText, parseSelector } from "../parser/parseSelector";
import { isHTMLElement } from "../hooks/useNewFixedElementAdded";
import { widgetId } from "../constants";

export interface RunOptions {
  mockNetworkRequests: boolean;
}

const interval = 10;
export const timeout = 4000;

export const withRetries = (callback: () => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      try {
        callback();
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

export const runEvent = (
  event: ParsedEvent,
  { mockNetworkRequests }: RunOptions
) => {
  if (isClickEvent(event)) {
    // todo: detect if right click
    getElement(parseSelector(event.target)).click();
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
      getElement<HTMLInputElement>(parseSelector(event.target)).value =
        event.value;
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
    const { target } = event;
    const el = getElement(
      parseSelector(event.target, { ignoreInnerText: true })
    );
    if (!!target.innerText && !el.innerText.includes(target.innerText)) {
      throw Error(
        `Timed out retrying after ${timeout}ms: expected '${parseSelector(
          target,
          { ignoreInnerText: true }
        )}' to contain '${target.innerText}'`
      );
    }
  }
};

// todo: make sure not in __widget__
const getElement = <T extends HTMLElement>(selector: string): T => {
  let el: T | null;
  if (!selector.includes("contains")) {
    el = document.querySelector(selector) as T;
  } else {
    const [tag, innerText] = extractInnerText(selector);
    el = findByInnerText(tag, innerText);
  }
  if (!el) {
    throw Error(
      `Timed out retrying after ${timeout}ms: Expected to find element: ${selector}, but never found it."`
    );
  }
  return el;
};

const findByInnerText = <T extends HTMLElement>(
  tag: string,
  innerText: string
): T | null => {
  const tags = document.getElementsByTagName(tag);
  for (let i = 0; i < tags.length; i++) {
    const el = tags[i];
    if (
      isHTMLElement(el) &&
      el.textContent?.includes(innerText!) &&
      el.childElementCount === 0 &&
      !document.getElementById(widgetId)!.contains(el)
    ) {
      return el as T;
    }
  }
  return null;
};
