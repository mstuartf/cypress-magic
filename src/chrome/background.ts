import { store } from "../apps/popup/redux/store";
import { restoreCache, setHasBeenInjected } from "../apps/popup/redux/slice";
import { readCache, updateCache } from "./utils";
import TabChangeInfo = chrome.tabs.TabChangeInfo;

chrome.runtime.onInstalled.addListener(() => {});

store.subscribe(async () => {
  await updateCache({ ...store.getState() });
  const { tabId, hasBeenInjected } = store.getState().root;
  if (!!tabId && !hasBeenInjected) {
    injectWidgetIfActivatedForTab(tabId, () => {
      store.dispatch(setHasBeenInjected());
    });
  }
});

readCache((state) => {
  store.dispatch(restoreCache(state.root));
});

export default {};

const injectWidgetIfActivatedForTab = (
  tabId: number,
  callback?: () => void
) => {
  chrome.scripting
    .executeScript({
      target: { tabId },
      files: ["static/js/content.js"],
      world: "MAIN",
    })
    .then(callback);
};

chrome.tabs.onUpdated.addListener(
  (tabId: number, changeInfo: TabChangeInfo) => {
    console.log(changeInfo);
    if (changeInfo.status === "loading") {
      const activatedForTab = store.getState().root.tabId;
      console.log(activatedForTab);
      if (activatedForTab === tabId) {
        console.log("injecting from background");
        injectWidgetIfActivatedForTab(activatedForTab);
      }
    }
  }
);
