import { parseSelector } from "../parser/parseSelector";
import { Target } from "../../../plugin/types";

export const get = <T extends HTMLElement>(domPath: Target["domPath"]): T => {
  const selector = parseSelector(domPath);
  const el = document.querySelector(selector) as T;
  if (!el) {
    // todo: add retries
    throw Error(
      `Timed out retrying after 4000ms: Expected to find element: ${selector}, but never found it."`
    );
  }
  return el;
};
