type W = typeof window & { chrome: boolean | null; opr?: boolean };

// https://stackoverflow.com/questions/4565112/javascript-how-to-find-out-if-the-user-browser-is-chrome
export const isChrome: () => boolean = () => {
  const w = window as W;

  const isChromium = w.chrome;
  const winNav = w.navigator;
  const vendorName = winNav.vendor;
  const isOpera = typeof w.opr !== "undefined";
  const isIEEdge = winNav.userAgent.indexOf("Edg") > -1;

  return (
    isChromium !== null &&
    typeof isChromium !== "undefined" &&
    vendorName === "Google Inc." &&
    isOpera === false &&
    isIEEdge === false
  );
};
