import {
  getSessionTestFileRequest,
  getState,
  updateState,
} from "./shared/utils";
import { setUpWindowMsgListener } from "./shared/messaging";

const setBadge = async (isRecording: boolean) => {
  await chrome.runtime.sendMessage({
    type: "set_badge",
    payload: isRecording ? "ON" : "OFF",
  });
};

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  const { type } = request;
  if (type === "stop_recording") {
    await updateState({ isRecording: false, hasReloaded: false });
    await setBadge(false);
    window.postMessage(
      {
        type: "stop_recording",
      },
      "*"
    );
  } else if (type === "start_recording") {
    await updateState({ isRecording: true, hasReloaded: false });
    location.reload();
  }
});

const onLoad = async () => {
  setUpWindowMsgListener(async ({ type, payload }) => {
    if (type === "save_session") {
      console.log(`trigger test gen for session ${payload.sessionId}`);
      await chrome.runtime.sendMessage({
        type: "get_session_file",
        payload: { sessionId: payload.sessionId },
      });
    }
  });

  const state = await getState();
  const { isRecording, hasReloaded } = state;
  if (isRecording && !hasReloaded) {
    const state = await getState();
    await updateState({ isRecording: true, hasReloaded: true });
    window.postMessage(
      {
        type: "start_recording",
        payload: {
          clientId: state.client_id,
        },
      },
      "*"
    );

    await setBadge(true);
  } else if (isRecording) {
    await updateState({ isRecording: false, hasReloaded: false });
    await setBadge(false);
  }
  return state.seasmoke;
};

onLoad();
