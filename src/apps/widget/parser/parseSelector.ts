import { Target } from "../../../plugin/types";

const escapeChars = (value: string) => value.replaceAll(":", "\\:");

export interface SelectOptions {
  ignoreInnerText?: boolean;
}

export const parseSelector = (
  target: Target,
  options?: SelectOptions
): string => {
  const el = target.domPath[target.domPath.length - 1];
  if (el.dataCy) {
    return `[data-cy="${escapeChars(el.dataCy)}"]`;
  }
  if (el.dataTestId) {
    return `[data-testid="${escapeChars(el.dataTestId)}"]`;
  }
  if (target.innerText && !options?.ignoreInnerText) {
    return `${target.tag.toLowerCase()}:contains('${target.innerText}')`;
  }

  const bottomUp = [...target.domPath].reverse();
  const selectors: string[] = [];
  for (let i = 0; i < bottomUp.length; i++) {
    const { nodeName, id, siblingCount, siblingIndex, dataTestId, dataCy } =
      bottomUp[i];
    if (dataCy) {
      selectors.push(`[data-cy="${escapeChars(dataCy)}"]`);
      break;
    } else if (dataTestId) {
      selectors.push(`[data-testid="${escapeChars(dataTestId)}"]`);
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
};

export const extractInnerText = (input: string): [string, string] => {
  const regex = /(\w+):contains\('(.+)'\)/;
  const match = input.match(regex)!;
  const [, firstGroup, secondGroup] = match;
  return [firstGroup, secondGroup];
};
