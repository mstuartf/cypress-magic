export const getAbsoluteUrl = (url: string): string =>
  url.startsWith("/") ? `${window.location.origin}${url}` : url;
