import { restoreCache } from "../redux/slice";
import { store } from "../redux/store";

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

store.subscribe(async () => {
  await chrome.storage.local.set({
    seasmoke: { ...store.getState() },
  });
});

const loadCache = async () => {
  console.log("dispatching loadCache");
  const state = await chrome.storage.local.get(["seasmoke"]);
  store.dispatch(restoreCache(state.seasmoke.user || null));
};

loadCache();

export default {};
