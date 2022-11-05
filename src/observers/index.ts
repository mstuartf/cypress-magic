import { initHistoryObserver } from "./history";
import { initFetchObserver } from "./fetch";
import { initUserObserver } from "./user";
import { initViewportObserver } from "./viewport";
import { initXMLHttpRequestObserver } from "./xml-http-request";
import { initLocalStorageObserver } from "./local-storage";

export const initializers = {
  history: initHistoryObserver,
  fetch: initFetchObserver,
  localStorage: initLocalStorageObserver,
  user: initUserObserver,
  viewport: initViewportObserver,
  xml: initXMLHttpRequestObserver,
};

export type Observer = keyof typeof initializers;
