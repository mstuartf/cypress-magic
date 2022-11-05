const setBadge = async (isRecording) => {
  await chrome.runtime.sendMessage({
    type: "set_badge",
    payload: isRecording ? "ON" : "OFF",
  });
};

const getState = async () => {
  const state = await chrome.storage.local.get(["seasmoke"]);
  return state.seasmoke || {};
};

const updateState = async (props) => {
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
  const { type } = request;
  if (type === "stop_recording") {
    stop();
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
  window.addEventListener("message", function ({ data }) {
    if (!data) {
      return;
    }
    const { type, payload } = data;
    if (type === "save_session") {
      console.log(`trigger test gen for session ${payload.sessionId}`);
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
