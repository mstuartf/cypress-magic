import { store } from "../apps/popup/redux/store";
import { restoreCache } from "../apps/popup/redux/slice";
import { readCache, updateCache } from "./utils";

chrome.runtime.onInstalled.addListener(() => {});

store.subscribe(async () => {
  await updateCache({ ...store.getState() });
});

readCache((state) => {
  store.dispatch(restoreCache(state.root));
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.tabs.executeScript({
    file: "./static/js/content.js",
    runAt: "document_start",
  });
});

export default {};
