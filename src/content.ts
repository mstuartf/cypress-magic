import initialize from "./initialize";

(window as any).TD_CLIENT_ID = "b7483b7f-bb53-4190-b9c9-8f01dbd29590";

console.log("starting");

const manager = () => {
  let deinit: () => void;
  const start = () => {
    deinit = initialize();
  };
  const stop = () => {
    deinit();
  };
  return { start, stop };
};
const { start, stop } = manager();

const setActionState = async (isRecording: boolean) => {
  await chrome.runtime.sendMessage({
    action: "set_badge",
    data: isRecording ? "ON" : "OFF",
  });
};

const getActionState = async () => {
  const state = await chrome.storage.local.get(["seasmoke"]);
  return state.seasmoke;
};

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  const { action } = request;
  if (action === "stop_recording") {
    stop();
    await chrome.storage.local.set({
      seasmoke: { isRecording: false, hasReloaded: false },
    });
    await setActionState(false);
  } else if (action === "start_recording") {
    await chrome.storage.local.set({
      seasmoke: { isRecording: true, hasReloaded: false },
    });
    location.reload();
  }
});

const onLoad = async () => {
  const state = await getActionState();
  if (!state) {
    return;
  }
  const { isRecording, hasReloaded } = state;
  if (isRecording && !hasReloaded) {
    await chrome.storage.local.set({
      seasmoke: { isRecording: true, hasReloaded: true },
    });
    start();
    await setActionState(true);
  } else if (isRecording) {
    await chrome.storage.local.set({
      seasmoke: { isRecording: false, hasReloaded: false },
    });
    await setActionState(false);
  }
  return state.seasmoke;
};

onLoad();
