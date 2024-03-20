import { Target } from "../../../plugin/types";

export function parseSelector(domPath: Target["domPath"]): string {
  const bottomUp = [...domPath].reverse();
  const selectors = [];
  for (let i = 0; i < domPath.length; i++) {
    const { nodeName, id, siblingCount, siblingIndex, dataTestId, dataCy } =
      bottomUp[i];
    if (dataCy) {
      selectors.push(`[data-cy="${dataCy}"]`);
      break;
    } else if (dataTestId) {
      selectors.push(`[data-testid="${dataTestId}"]`);
      break;
    } else if (id) {
      selectors.push(`#${id}`);
      break;
    } else if (siblingCount > 1) {
      selectors.push(
        `${nodeName.toLowerCase()}:nth-of-type(${siblingIndex + 1})`
      );
    } else {
      selectors.push(`${nodeName.toLowerCase()}`);
    }
  }
  return [...selectors].reverse().join(" > ");
}

export function parseSelectorPositionOnly(domPath: Target["domPath"]): string {
  const selectors = [];
  for (let i = 0; i < domPath.length; i++) {
    const { nodeName, id, siblingCount, siblingIndex, dataTestId, dataCy } =
      domPath[i];
    if (siblingCount > 1) {
      selectors.push(
        `${nodeName.toLowerCase()}:nth-of-type(${siblingIndex + 1})`
      );
    } else {
      selectors.push(`${nodeName.toLowerCase()}`);
    }
  }
  return [...selectors].join(" > ");
}
