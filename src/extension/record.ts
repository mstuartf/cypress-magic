import {
  getActiveTabId,
  getSessionTestFileRequest,
  getState,
  setDisabledState,
} from "./shared/utils";

const recordBtn: HTMLButtonElement = document.querySelector("#recordBtn");
const logoutBtn: HTMLButtonElement = document.querySelector("#logoutBtn");
const email: HTMLElement = document.getElementById("email");

const setButtonText = async () => {
  const state = await getState();
  recordBtn.innerText = state.isRecording ? "turn off" : "turn on";
  email.innerText = state.email_address;
};

recordBtn.addEventListener("click", async () => {
  setDisabledState([recordBtn, logoutBtn], true);
  const tabId = await getActiveTabId();
  const state = await getState();
  await chrome.tabs.sendMessage(tabId, {
    type: state?.isRecording ? "stop_recording" : "start_recording",
  });
  // window.close();
});

logoutBtn.addEventListener("click", async () => {
  await chrome.runtime.sendMessage(
    {
      type: "logout",
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
