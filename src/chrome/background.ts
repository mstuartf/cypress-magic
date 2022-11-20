import { RootState, store } from "../redux/store";
import {
  restoreCache,
  saveEvent,
  saveFixture,
  saveSessionId,
  startRecording,
  stopRecording,
  updateAliases,
} from "../redux/slice";
import { readCache, setBadgeText, updateCache } from "./utils";
import RegisteredContentScript = chrome.scripting.RegisteredContentScript;
import { EventManager } from "../plugin/types";
import { createWsClient } from "../plugin/managers";

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

let ws: EventManager;

// have to handle sockets stuff here (rather than in middleware) for betting logging
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (
    request.type === "chromex.dispatch" &&
    request.payload.type === startRecording.type
  ) {
    const {
      user: {
        info: { client_id },
      },
    }: RootState = store.getState();
    ws = createWsClient(client_id!);
  }
  if (
    request.type === "chromex.dispatch" &&
    request.payload.type === stopRecording.type
  ) {
    const sessionId = ws.close();
    store.dispatch(saveSessionId(sessionId));
  }
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
    ws.saveEvent(request.payload);
  }
  if (request.type === updateAliases.type) {
    store.dispatch(
      updateAliases({ aliases: JSON.parse(request.payload.aliases) })
    );
  }
});

store.subscribe(async () => {
  await updateCache({ ...store.getState() });
});

readCache((state) => {
  store.dispatch(restoreCache(state.user));
});

export default {};
