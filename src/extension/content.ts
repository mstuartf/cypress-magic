import {
  getState,
  Msg,
  sendWindowMsg,
  setUpWindowMsgListener,
  updateState,
} from "./shared";

const sendMsgToInject = (msg: Msg) => sendWindowMsg(msg);
const sendMsgToBackground = async (msg: Msg, callback?: (res: any) => void) => {
  await chrome.runtime.sendMessage(msg, callback);
};
const sendMsgToPopup = async (msg: Msg) => {
  await chrome.runtime.sendMessage(msg);
};

const setBadge = async (isRecording: boolean) => {
  await sendMsgToBackground({
    type: "set_badge",
    payload: isRecording ? "ON" : "OFF",
    meta: { from: "content", to: "background" },
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
    sendMsgToInject({
      type: "stop_recording",
      meta: { from: "content", to: "inject" },
    });
  } else if (type === "start_recording") {
    await updateState({ isRecording: true, hasReloaded: false });
    location.reload();
  }
});

const onLoad = async () => {
  setUpWindowMsgListener(async ({ type, payload }) => {
    if (type === "save_session") {
      console.log(`trigger test gen for session ${payload.sessionId}`);
      await sendMsgToPopup({
        type: "get_session_file",
        payload: { sessionId: payload.sessionId },
        meta: { from: "content", to: "popup" },
      });
    }
  });

  const state = await getState();
  const { isRecording, hasReloaded } = state;
  if (isRecording && !hasReloaded) {
    const state = await getState();
    await updateState({ isRecording: true, hasReloaded: true });
    sendMsgToInject({
      type: "start_recording",
      meta: { from: "content", to: "inject" },
      payload: {
        clientId: state.client_id,
      },
    });
    await setBadge(true);
  } else if (isRecording) {
    await updateState({ isRecording: false, hasReloaded: false });
    await setBadge(false);
  }
  return state.seasmoke;
};

onLoad();
