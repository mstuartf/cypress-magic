import * as redux from "redux";
import { startRecording, stopRecording } from "./slice";
import { sendMsgToContent, setBadgeText } from "../chrome/utils";
import { RootState } from "./store";

export const msgMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type === startRecording.type) {
      const {
        user: {
          info: { client_id },
        },
      }: RootState = store.getState();
      setBadgeText("ON").then(() => {
        sendMsgToContent({ type: action.type, payload: { client_id } });
      });
    }
    if (action.type === stopRecording.type) {
      setBadgeText("OFF").then(() => {
        sendMsgToContent({ type: action.type });
      });
    }
    next(action);
  };
