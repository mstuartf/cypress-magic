import { initNavObserver } from "./nav";
import { initFetchObserver } from "./fetch";
import { initStorageObserver } from "./storage";
import { initUserObserver } from "./user";
import { initViewportObserver } from "./viewport";
import { initXMLHttpRequestObserver } from "./xml-http-request";

export const initializers = {
  navigation: initNavObserver,
  fetch: initFetchObserver,
  storage: initStorageObserver,
  user: initUserObserver,
  viewport: initViewportObserver,
  xml: initXMLHttpRequestObserver,
};

export type Observer = keyof typeof initializers;
