import { DomPathNode } from "../types";

export function getDomPath(el: HTMLElement): DomPathNode[] {
  const stack: DomPathNode[] = [];
  while (el.parentNode != null) {
    let sibCount = 0;
    let sibIndex = 0;
    for (let i = 0; i < el.parentNode.childNodes.length; i++) {
      let sib = el.parentNode.childNodes[i];
      if (sib.nodeName == el.nodeName) {
        if (sib === el) {
          sibIndex = sibCount;
        }
        sibCount++;
      }
    }
    const domPathNode: DomPathNode = {
      nodeName: el.nodeName,
      siblingCount: sibCount,
      siblingIndex: sibIndex,
      id: el.id,
      dataCy: el.dataset.cy!,
      dataTestId: el.dataset.testId!,
    };
    stack.unshift(domPathNode);
    el = el.parentNode as HTMLElement;
  }

  return stack.slice(1); // removes the html element
}
