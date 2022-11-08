import * as redux from "redux";

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
    // if (["user/startRecording", "user/stopRecording"].includes(action.type)) {
    sendMsgToContent({ type: action.type, payload: action.payload });
    // }
    next(action);
  };
