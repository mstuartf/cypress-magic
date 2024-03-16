import { Target } from "../../../plugin/types";

export function parseSelector(domPath: Target["domPath"]): string {
  const selectors = domPath.map(
    ({ nodeName, id, siblingCount, siblingIndex, dataTestId, dataCy }) => {
      let selector: string = `${nodeName.toLowerCase()}`;
      if (dataCy) {
        selector += `[data-cy="${dataCy}"]`;
      } else if (dataTestId) {
        selector += `[data-testid="${dataTestId}"]`;
      } else if (id) {
        selector += `#${id}`;
      } else if (siblingCount > 1) {
        selector += `:nth-of-type(${siblingIndex + 1})`;
      }
      return selector;
    }
  );
  return selectors.join(" > ");
}
