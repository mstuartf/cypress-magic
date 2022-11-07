// chrome.runtime.sendMessage
// chrome.runtime.onMessage.addListener

import { ChromeMsgListener, ChromeMsgArgs } from "./types";

export const setUpChromeMsgListener = (listener: ChromeMsgListener) => {
  chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    listener(msg, sendResponse);
  });
};

export const sendChromeMsg = (args: ChromeMsgArgs) => {
  chrome.runtime.sendMessage(args);
};
