import { store } from "../redux/store";
import { restoreCache, saveEvent, saveFixture } from "../redux/slice";
import { readCache, setBadgeText, updateCache } from "./utils";
import RegisteredContentScript = chrome.scripting.RegisteredContentScript;

chrome.runtime.onInstalled.addListener(() => {
  setBadgeText("OFF");
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

// this message comes from inject -> content -> background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === saveFixture.type) {
    store.dispatch(
      saveFixture({
        name: request.payload.name,
        value: request.payload.value,
      })
    );
  }
  if (request.type === saveEvent.type) {
    store.dispatch(saveEvent(request.payload));
  }
});

store.subscribe(async () => {
  await updateCache({ ...store.getState() });
});

readCache((state) => {
  store.dispatch(restoreCache(state.user));
});

export default {};
