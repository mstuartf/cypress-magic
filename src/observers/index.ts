import { initHistoryObserver } from "./history";
import { initFetchObserver } from "./fetch";
import { initUserObserver } from "./user";
import { initViewportObserver } from "./viewport";
import { initXMLHttpRequestObserver } from "./xml-http-request";
import { initCookieObserver } from "./cookies";
import { initStorageObserver } from "./storage";

export const initializers = {
  history: initHistoryObserver,
  fetch: initFetchObserver,
  storage: initStorageObserver,
  user: initUserObserver,
  viewport: initViewportObserver,
  xml: initXMLHttpRequestObserver,
  cookies: initCookieObserver,
};

export type Observer = keyof typeof initializers;
