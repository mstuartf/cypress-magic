import { getActiveTabId, getState, setDisabledState } from "./shared/utils";
import { Msg } from "./shared/messaging";

const recordBtn: HTMLButtonElement = document.querySelector("#recordBtn");
const logoutBtn: HTMLButtonElement = document.querySelector("#logoutBtn");
const email: HTMLElement = document.getElementById("email");

const sendMsgToContent = async (msg: Msg) => {
  const tabId = await getActiveTabId();
  await chrome.tabs.sendMessage(tabId, msg);
};
const sendMsgToBackground = async (msg: Msg, callback?: (res: any) => void) => {
  await chrome.runtime.sendMessage(msg, callback);
};

const setButtonText = async () => {
  const state = await getState();
  recordBtn.innerText = state.isRecording ? "turn off" : "turn on";
  email.innerText = state.email_address;
};

recordBtn.addEventListener("click", async () => {
  setDisabledState([recordBtn, logoutBtn], true);
  const state = await getState();
  await sendMsgToContent({
    type: state?.isRecording ? "stop_recording" : "start_recording",
    meta: { from: "popup", to: "content" },
  });
  // window.close();
});

logoutBtn.addEventListener("click", async () => {
  await sendMsgToBackground(
    {
      type: "logout",
      meta: { from: "popup", to: "background" },
    },
    () => {
      window.close();
    }
  );
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "get_session_file") {
    email.innerText = "get_session_file";
    console.log(request.payload);
  }
});

setButtonText();
