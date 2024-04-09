import { store } from "../apps/popup/redux/store";
import {
  removeClosedTabId,
  restoreBaseCache,
  saveUserInfo,
} from "../apps/popup/redux/slice";
import { activeTabNeedsRefresh, inject, readCache, updateCache } from "./utils";
import { selectInjectForTab } from "../apps/popup/redux/selectors";
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import AccountStatus = chrome.identity.AccountStatus;

// READING AND WRITING TO CACHE ------------------------------------------------

readCache().then((state) => {
  store.dispatch(restoreBaseCache(state.base));
});

chrome.identity.getProfileUserInfo(
  { accountStatus: AccountStatus.ANY },
  (res) => {
    store.dispatch(saveUserInfo(res));
  }
);

store.subscribe(() => {
  const updated = { ...store.getState() };
  readCache().then((current) => {
    updateCache(updated).then(() => {
      // This needs to be done here (not in middleware) because we need to be sure the cache is updated _before_ the refresh.
      if (activeTabNeedsRefresh(current.base, updated.base)) {
        chrome.tabs.reload();
      }
    });
  });
});

// LISTENING FOR TAB EVENTS ----------------------------------------------------

chrome.tabs.onRemoved.addListener((tabId) =>
  store.dispatch(removeClosedTabId(tabId))
);

// Handles re-injection when the extension has already been activated but the page is refreshed
chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: TabChangeInfo) => {
    if (changeInfo.status === "loading") {
      // Need to read from the cache not the store (store may have default values loaded sync).
      readCache().then((state) => {
        const shouldInject = selectInjectForTab(tabId)(state);
        if (shouldInject) {
          inject(tabId).catch((e) => {
            // when a new version of the extension is loaded it needs to be re-injected
            if (e.message.includes("Cannot access contents of the page")) {
              store.dispatch(removeClosedTabId(tabId));
            } else {
              throw e;
            }
          });
        }
      });
    }
  }
);

export default {};
