import { Target } from "../../../plugin/types";
import { formatAsJSLiteral } from "./formatAsJSLiteral";
import { parseSelector } from "./parseSelector";

export function getElementCy(domPath: Target["domPath"]): string {
  return `cy.get(${formatAsJSLiteral(parseSelector(domPath))})`;
}
