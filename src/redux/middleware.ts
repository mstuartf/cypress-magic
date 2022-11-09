import * as redux from "redux";
import {
  loadCache,
  restoreCache,
  startRecording,
  stopRecording,
} from "./slice";
import { readCache, sendMsgToContent, setBadgeText } from "../chrome/utils";

export const msgMiddleware: redux.Middleware =
  (store) => (next) => (action) => {
    if (action.type === startRecording.type) {
      const {
        user: {
          info: { client_id },
        },
      } = store.getState();
      setBadgeText("ON").then(() => {
        sendMsgToContent({ type: action.type, payload: { client_id } }).then(
          () => {
            window.close(); // close the popup when the recording starts
          }
        );
      });
    }
    if (action.type === stopRecording.type) {
      setBadgeText("OFF").then(() => {
        sendMsgToContent({ type: action.type });
      });
    }
    if (action.type === loadCache.type) {
      readCache().then((state) => {
        store.dispatch(restoreCache(state.seasmoke?.user || null));
      });
    }
    next(action);
  };
