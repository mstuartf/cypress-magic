import * as redux from "redux";
import { startRecording, stopRecording } from "./slice";
import { sendMsgToContent, setBadgeText } from "../chrome/utils";

export const msgMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type === startRecording.type) {
      next(action);
      setBadgeText("ON").then(() => {
        sendMsgToContent({ type: action.type });
      });
    } else if (action.type === stopRecording.type) {
      next(action);
      setBadgeText("OFF").then(() => {
        sendMsgToContent({ type: action.type });
      });
      next(action);
    } else {
      next(action);
    }
  };
