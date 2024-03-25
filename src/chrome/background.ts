import { store } from "../apps/popup/redux/store";
import {
  initialBaseState,
  restoreBaseCache,
  setActiveTabId,
} from "../apps/popup/redux/slice";
import { inject, readCache, updateCache } from "./utils";
import { selectInjectForTab } from "../apps/popup/redux/selectors";
import TabChangeInfo = chrome.tabs.TabChangeInfo;

console.log("background running", new Date().toString());

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

// subscribe to all store updates and sync cache
store.subscribe(async () => {
  console.log(`updating to ${JSON.stringify(store.getState())}`);
  await updateCache({ ...store.getState() });
});

chrome.tabs.onActivated.addListener(({ tabId }) =>
  store.dispatch(setActiveTabId(tabId))
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
