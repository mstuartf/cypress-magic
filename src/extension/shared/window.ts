import { Msg, MsgListener } from "./types";

export const setUpWindowMsgListener = (listener: MsgListener) => {
  window.addEventListener("message", ({ data }) => {
    listener(data);
  });
};

export const sendWindowMsg = (msg: Msg) => {
  window.postMessage(msg, "*");
};
