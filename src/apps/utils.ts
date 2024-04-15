import { isHTMLElement } from "./widget/hooks/useNewFixedElementAdded";
import { widgetId } from "./widget/constants";

export const findAllTagsWithInnerText = <T extends HTMLElement>(
  tag: string,
  innerText: string
): T[] => {
  const tags = document.getElementsByTagName(tag);
  const results = [];
  for (let i = 0; i < tags.length; i++) {
    const el = tags[i];
    if (
      isHTMLElement(el) &&
      el.textContent?.includes(innerText!) &&
      el.childElementCount === 0 &&
      !document.getElementById(widgetId)!.contains(el)
    ) {
      results.push(el as T);
    }
  }
  return results;
};
