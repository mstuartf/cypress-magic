import * as redux from "redux";
import { cancelRecording, startRecording, stopRecording } from "./slice";
import { sendMsgToContent, setBadgeText } from "../chrome/utils";

export const msgMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type === startRecording.type) {
      setBadgeText("ON").then(() => {
        chrome.tabs.reload();
      });
    }
    if (action.type === stopRecording.type) {
      setBadgeText("OFF").then(() => {
        sendMsgToContent({ type: action.type });
      });
    }
    if (action.type === cancelRecording.type) {
      setBadgeText("OFF");
    }
    next(action);
  };
