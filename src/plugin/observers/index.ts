import { initFetchObserver } from "./fetch";
import { initUserObserver } from "./user";
import { initXMLHttpRequestObserver } from "./xml-http-request";
import { initNavigationObserver } from "./navigation";

export const initializers = {
  fetch: initFetchObserver,
  user: initUserObserver,
  xml: initXMLHttpRequestObserver,
  navigation: initNavigationObserver,
};

export type Observer = keyof typeof initializers;
