import { store } from "../apps/popup/redux/store";
import {
  initialBaseState,
  removeClosedTabId,
  restoreBaseCache,
} from "../apps/popup/redux/slice";
import { inject, readCache } from "./utils";
import { selectInjectForTab } from "../apps/popup/redux/selectors";
import TabChangeInfo = chrome.tabs.TabChangeInfo;

// READING AND WRITING TO CACHE ------------------------------------------------

readCache().then((value) => {
  console.log(`found ${JSON.stringify(value)} in storage`);
  const state =
    value && Object.keys(value).length
      ? value
      : { base: { ...initialBaseState } };
  console.log(
    "restoring cache",
    new Date().toString(),
    JSON.stringify(state.base)
  );
  store.dispatch(restoreBaseCache(state.base));
});

// LISTENING FOR TAB EVENTS ----------------------------------------------------

chrome.tabs.onRemoved.addListener((tabId) =>
  store.dispatch(removeClosedTabId(tabId))
);

// handles re-injection when the extension has already been activated but the page is refreshed
chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: TabChangeInfo) => {
    if (changeInfo.status === "loading") {
      console.log(
        `injected on ${JSON.stringify(store.getState().base.injectOnTabs)}`
      );
      const shouldInject = selectInjectForTab(tabId)(store.getState());
      if (shouldInject) {
        console.log("injecting from background");
        inject(tabId);
      }
    }
  }
);

export default {};
