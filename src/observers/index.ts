import { initHistoryObserver } from "./history";
import { initFetchObserver } from "./fetch";
import { initUserObserver } from "./user";
import { initViewportObserver } from "./viewport";
import { initXMLHttpRequestObserver } from "./xml-http-request";
import { initCookieObserver } from "./cookies";
import { initLocalStorageObserver } from "./localStorage";
import { initSessionStorageObserver } from "./sessionStorage";

export const initializers = {
  history: initHistoryObserver,
  fetch: initFetchObserver,
  localStorage: initLocalStorageObserver,
  sessionStorage: initSessionStorageObserver,
  user: initUserObserver,
  viewport: initViewportObserver,
  xml: initXMLHttpRequestObserver,
  cookies: initCookieObserver,
};

export type Observer = keyof typeof initializers;
