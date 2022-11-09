import { store } from "../redux/store";
import RegisteredContentScript = chrome.scripting.RegisteredContentScript;
import {
  cancelRecording,
  restoreCache,
  saveSession,
  startRecording,
} from "../redux/slice";
import {
  readCache,
  sendMsgToContent,
  setBadgeText,
  updateCache,
} from "./utils";

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
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === saveSession.type) {
    store.dispatch(saveSession({ session_id: request.payload.session_id }));
  }
});

store.subscribe(async () => {
  await updateCache({ ...store.getState() });
});

readCache((state) => {
  store.dispatch(restoreCache(state.user));
});

export default {};
