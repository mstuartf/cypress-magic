import { parseSelector } from "../parser/parseSelector";
import { Target } from "../../../plugin/types";

export const get = <T extends HTMLElement>(domPath: Target["domPath"]): T => {
  const selector = parseSelector(domPath);
  const el = document.querySelector(selector) as T;
  if (!el) {
    throw Error(`Could not find "${selector}"`);
  }
  return el;
};
