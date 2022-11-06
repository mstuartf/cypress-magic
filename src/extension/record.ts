import { getActiveTabId, getState } from "./shared/utils";

const recordBtn: HTMLElement = document.querySelector("#recordBtn");
const logoutBtn: HTMLElement = document.querySelector("#logoutBtn");
const email: HTMLElement = document.getElementById("email");

const setButtonText = async () => {
  const state = await getState();
  recordBtn.innerText = state.isRecording ? "turn off" : "turn on";
  email.innerText = state.email_address;
};

recordBtn.addEventListener("click", async () => {
  const tabId = await getActiveTabId();
  const state = await getState();
  await chrome.tabs.sendMessage(tabId, {
    type: state?.isRecording ? "stop_recording" : "start_recording",
  });
  window.close();
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

setButtonText();
