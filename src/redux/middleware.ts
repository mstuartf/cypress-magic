import * as redux from "redux";
import {
  loadCache,
  restoreCache,
  startRecording,
  stopRecording,
} from "./slice";

export const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id!;
};

const sendMsgToContent = async (msg: any) => {
  const tabId = await getActiveTabId();
  await chrome.tabs.sendMessage(tabId, msg);
};

export const msgMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type === startRecording.type) {
      const {
        user: {
          info: { client_id },
        },
      } = store.getState();
      sendMsgToContent({ type: action.type, payload: { client_id } });
    }
    if (action.type === stopRecording.type) {
      sendMsgToContent({ type: action.type });
    }
    if (action.type === loadCache.type) {
      chrome.storage.local.get(["seasmoke"]).then((state) => {
        store.dispatch(restoreCache(state.seasmoke?.user || null));
      });
    }
    next(action);
  };
