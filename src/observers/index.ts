import { initNavObserver } from "./nav";
import { initRequestsObserver } from "./requests";
import { initStorageObserver } from "./storage";
import { initUserObserver } from "./user";
import { initViewportObserver } from "./viewport";

export const initializers = {
  navigation: initNavObserver,
  requests: initRequestsObserver,
  storage: initStorageObserver,
  user: initUserObserver,
  viewport: initViewportObserver,
};

export type Observer = keyof typeof initializers;
