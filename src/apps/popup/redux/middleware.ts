import * as redux from "redux";
import { startRecording, stopRecording } from "./slice";
import { sendMsgToContent } from "../../../chrome/utils";

export const msgMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (
      action.type === startRecording.type ||
      action.type === stopRecording.type
    ) {
      sendMsgToContent({ type: action.type });
    }
    next(action);
  };
