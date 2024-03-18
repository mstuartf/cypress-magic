import { Target } from "../../../plugin/types";
import { parseSelector } from "./parseSelector";

export function getElementCy(domPath: Target["domPath"]): string {
  return `cy.get('${parseSelector(domPath)}')`;
}
