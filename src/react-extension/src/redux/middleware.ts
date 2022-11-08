import * as redux from "redux";
import { store } from "./store";
import { restoreCache } from "./slice";

export const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id!;
};

const sendMsgToContent = async (msg: any) => {
  const tabId = await getActiveTabId();
  await chrome.tabs.sendMessage(tabId, msg);
};

// const sendMsgToBackground = async (msg: any, callback?: (res: any) => void) => {
//   await chrome.runtime.sendMessage(msg, callback);
// };

export const msgMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    console.log("Middleware triggered:", action);
    if (
      [
        "user/startRecording",
        "user/stopRecording",
        "user/restoreCache",
      ].includes(action.type)
    ) {
      sendMsgToContent({ type: action.type, payload: action.payload });
    }
    if (action.type === "user/loadCache") {
      chrome.storage.local.get(["seasmoke"]).then((state) => {
        store.dispatch(restoreCache(state.seasmoke?.user || null));
      });
    }
    next(action);
  };
