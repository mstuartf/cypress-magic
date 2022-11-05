const recordBtn = document.querySelector("#recordBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const email = document.getElementById("email");

const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id;
};

const getState = async () => {
  const state = await chrome.storage.local.get(["seasmoke"]);
  return state.seasmoke || {};
};

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
