// This script is injected into the MAIN process by the background script.
// It does not have access to the Chrome extension APIs.

import initialize from "../initialize";
import { Observer } from "../observers";
import { Msg, sendWindowMsg, setUpWindowMsgListener } from "./shared/messaging";

const sendMsgToContent = (msg: Msg) => sendWindowMsg(msg);

const observers: Observer[] = [
  "history",
  "localStorage",
  "sessionStorage",
  "fetch",
  "user",
  "viewport",
  "xml",
  "cookies",
];

const manager = () => {
  let deinit: () => string;
  const start = (clientId: string) => {
    deinit = initialize(clientId, observers, true);
  };
  const stop = () => {
    const sessionId = deinit();
    sendMsgToContent({
      type: "save_session",
      meta: { from: "inject", to: "content" },
      payload: { sessionId },
    });
  };
  return { start, stop };
};
const { start, stop } = manager();

setUpWindowMsgListener(({ type, meta, payload }) => {
  if (type === "start_recording") {
    start(payload.clientId);
  } else if (type === "stop_recording") {
    stop();
  }
});
