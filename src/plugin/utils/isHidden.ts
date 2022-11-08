export const isHidden = (el: HTMLElement): boolean => {
  // If the element is hidden (for example, by setting style.display
  // on the element or one of its ancestors to "none"), then 0 is returned.
  if (el.offsetWidth <= 0 || el.offsetHeight <= 0) {
    return true;
  }
  const { visibility, opacity } = window.getComputedStyle(el);
  // if the effective visibility of the element
  // is hidden (which includes any parent nodes) then the user
  // cannot interact with this element and thus it is hidden
  if (visibility === "hidden" || visibility === "collapse") {
    return true;
  }
  // a transparent element is hidden
  if (opacity === "0") {
    return true;
  }
  return false;
};
