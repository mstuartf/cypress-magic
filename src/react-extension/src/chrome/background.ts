import { restoreCache } from "../redux/slice";
import { store } from "../redux/store";
import RegisteredContentScript = chrome.scripting.RegisteredContentScript;

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

// https://stackoverflow.com/a/72607832
// todo: should this only be on install?
chrome.runtime.onInstalled.addListener(async () => {
  const scripts: RegisteredContentScript[] = [
    {
      id: "inject",
      js: ["./static/js/inject.js"],
      matches: ["https://*/*"],
      runAt: "document_start",
      world: "MAIN",
    },
  ];
  const ids = scripts.map((s) => s.id);
  await chrome.scripting.unregisterContentScripts({ ids }).catch(() => {});
  await chrome.scripting.registerContentScripts(scripts).catch(() => {});
});

store.subscribe(async () => {
  await chrome.storage.local.set({
    seasmoke: { ...store.getState() },
  });
});

const loadCache = async () => {
  console.log("dispatching loadCache");
  const state = await chrome.storage.local.get(["seasmoke"]);
  store.dispatch(restoreCache(state.seasmoke?.user || null));
};

loadCache();

export default {};
