import { initHistoryObserver } from "./history";
import { initFetchObserver } from "./fetch";
import { initUserObserver } from "./user";
import { initViewportObserver } from "./viewport";
import { initXMLHttpRequestObserver } from "./xml-http-request";

export const initializers = {
  history: initHistoryObserver,
  fetch: initFetchObserver,
  user: initUserObserver,
  viewport: initViewportObserver,
  xml: initXMLHttpRequestObserver,
};

export type Observer = keyof typeof initializers;
