import initialize from "./initialize";
import { Observer } from "./observers";

const observers: Observer[] = ["navigation", "storage", "user", "viewport"];

const manager = () => {
  let deinit: () => void;
  const start = (clientId: string) => {
    deinit = initialize(clientId, observers, true);
  };
  const stop = () => {
    deinit();
  };
  return { start, stop };
};
const { start, stop } = manager();

const setBadge = async (isRecording: boolean) => {
  await chrome.runtime.sendMessage({
    action: "set_badge",
    data: isRecording ? "ON" : "OFF",
  });
};

const getState = async () => {
  const state = await chrome.storage.local.get(["seasmoke"]);
  return state.seasmoke || {};
};

const updateState = async (props: object) => {
  const state = await getState();
  await chrome.storage.local.set({
    seasmoke: { ...state, ...props },
  });
};

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  const { action } = request;
  if (action === "stop_recording") {
    stop();
    await updateState({ isRecording: false, hasReloaded: false });
    await setBadge(false);
  } else if (action === "start_recording") {
    await updateState({ isRecording: true, hasReloaded: false });
    location.reload();
  }
});

const onLoad = async () => {
  const state = await getState();
  const { isRecording, hasReloaded } = state;
  if (isRecording && !hasReloaded) {
    const state = await getState();
    await updateState({ isRecording: true, hasReloaded: true });
    start(state.client_id);
    await setBadge(true);
  } else if (isRecording) {
    await updateState({ isRecording: false, hasReloaded: false });
    await setBadge(false);
  }
  return state.seasmoke;
};

onLoad();
