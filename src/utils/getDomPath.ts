export function getDomPath(el: HTMLElement): string[] {
  const stack: string[] = [];
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
    const nodeName = el.nodeName.toLowerCase();
    if (!!el.dataset && !!el.dataset.cy) {
      stack.unshift(`${nodeName}[data-cy="${el.dataset.cy}"]`);
    } else if (!!el.dataset && !!el.dataset.testid) {
      stack.unshift(`${nodeName}[data-testid="${el.dataset.testid}"]`);
    } else if (
      typeof el.hasAttribute === "function" &&
      el.hasAttribute("id") &&
      el.id != ""
    ) {
      stack.unshift(`${nodeName}#${el.id}`);
    } else if (sibCount > 1) {
      stack.unshift(`${nodeName}:nth-child("${sibIndex}")`);
    } else {
      stack.unshift(nodeName);
    }
    el = el.parentNode as HTMLElement;
  }

  return stack.slice(1); // removes the html element
}
