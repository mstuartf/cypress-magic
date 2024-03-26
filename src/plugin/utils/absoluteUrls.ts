import { isAbsoluteUrl } from "../observers/history";

export const getAbsoluteUrl = (url: string): string =>
  !isAbsoluteUrl(url) ? `${window.location.origin}${url}` : url;
