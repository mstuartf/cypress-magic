// The first event our service worker will listen for is runtime.onInstalled().
import { getActiveTabId, getState, Msg, updateState } from "./shared";
import RegisteredContentScript = chrome.scripting.RegisteredContentScript;

const sendMsgToPopup = (msg: Msg) => {};
const sendMsgToContent = (msg: Msg) => {};

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

// https://stackoverflow.com/a/72607832
chrome.runtime.onInstalled.addListener(async () => {
  const scripts: RegisteredContentScript[] = [
    {
      id: "inject",
      js: ["scripts/inject.js"],
      matches: ["https://*/*"],
      runAt: "document_start",
      world: "MAIN",
    },
  ];
  const ids = scripts.map((s) => s.id);
  await chrome.scripting.unregisterContentScripts({ ids }).catch(() => {});
  await chrome.scripting.registerContentScripts(scripts).catch(() => {});
});

const checkAuthStatus = () =>
  new Promise(async (resolve) => {
    const state = await getState();
    resolve(!!state.client_id);
  });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const { type, payload } = request;
  if (type === "set_badge") {
    getActiveTabId().then((tabId) => {
      chrome.action.setBadgeText({ tabId, text: payload });
    });
  }
  if (type === "login") {
    const { email_address, client_id, token } = payload;
    updateState({ email_address, client_id, token }).then(() => {
      chrome.action.setPopup({ popup: "record.html" }).then(() => {
        sendResponse(true);
      });
    });
    return true;
  }
  if (type === "logout") {
    updateState({ email_address: null, client_id: null }).then(() => {
      getActiveTabId().then((tabId) => {
        chrome.action.setBadgeText({ tabId, text: "OFF" }).then(() => {
          chrome.action.setPopup({ popup: "login.html" }).then(() => {
            sendResponse(true);
          });
        });
      });
    });
    return true;
  }
});

// choose the right template on first load
checkAuthStatus().then((isLoggedIn) => {
  chrome.action.setPopup({ popup: isLoggedIn ? "record.html" : "login.html" });
});
