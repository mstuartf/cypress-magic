import { store } from "../apps/popup/redux/store";
import { restoreCache, setActiveTabId } from "../apps/popup/redux/slice";
import { inject, readCache, updateCache } from "./utils";
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import { useSelector } from "react-redux";
import { selectInjectForTab } from "../apps/popup/redux/selectors";

chrome.runtime.onInstalled.addListener(() => {});

readCache((state) => {
  store.dispatch(restoreCache(state.root));
});

chrome.tabs.onActivated.addListener(({ tabId }) =>
  store.dispatch(setActiveTabId(tabId))
);

// subscribe to all store updates and sync cache
store.subscribe(async () => {
  await updateCache({ ...store.getState() });
});

// handles re-injection when the extension has already been activated but the page is refreshed
chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: TabChangeInfo) => {
    if (changeInfo.status === "loading") {
      const shouldInject = selectInjectForTab(tabId)(store.getState());
      if (shouldInject) {
        console.log("injecting from background");
        inject(tabId);
      }
    }
  }
);

export default {};
