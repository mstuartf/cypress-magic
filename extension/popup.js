const button = document.querySelector("button");

const getActiveTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id;
};

const getActionState = async () => {
  const state = await chrome.storage.local.get(["seasmoke"]);
  return state.seasmoke || {};
};

const setButtonText = async () => {
  const state = await getActionState();
  button.innerText = state.isRecording ? "turn off" : "turn on";
};

button.addEventListener("click", async () => {
  const tabId = await getActiveTabId();
  const state = await getActionState();
  await chrome.tabs.sendMessage(tabId, {
    action: state?.isRecording ? "stop_recording" : "start_recording",
  });
  window.close();
});

setButtonText();
