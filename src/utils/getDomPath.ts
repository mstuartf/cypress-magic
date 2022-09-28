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
    if (
      typeof el.hasAttribute === "function" &&
      el.hasAttribute("id") &&
      el.id != ""
    ) {
      stack.unshift(el.nodeName.toLowerCase() + "#" + el.id);
    } else if (sibCount > 1) {
      stack.unshift(el.nodeName.toLowerCase() + ":eq(" + sibIndex + ")");
    } else {
      stack.unshift(el.nodeName.toLowerCase());
    }
    el = el.parentNode as HTMLElement;
  }

  return stack.slice(1); // removes the html element
}
