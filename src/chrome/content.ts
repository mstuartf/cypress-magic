import { saveSession, startRecording, stopRecording } from "../redux/slice";

chrome.runtime.onMessage.addListener(function (request) {
  if (!request) {
    return;
  }
  if (request.type === startRecording.type) {
    chrome.storage.sync.set(
      { forceReload: true, client_id: request.payload.client_id },
      function () {
        window.location.reload();
      }
    );
  }
  if (request.type === stopRecording.type) {
    window.postMessage({
      type: request.type,
    });
  }
});

window.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) {
    return;
  }
  if (event.data.type === saveSession.type) {
    console.log(`save session from content: ${event.data.payload.session_id}`);
    chrome.runtime.sendMessage({
      type: saveSession.type,
      payload: { session_id: event.data.payload.session_id },
    });
  }
});

chrome.storage.sync.get(["forceReload", "client_id"], function (items) {
  const { forceReload, client_id } = items;
  if (forceReload) {
    chrome.storage.sync.set({ forceReload: false }, function () {
      window.postMessage({
        type: startRecording.type,
        payload: { client_id },
      });
    });
  }
});

export default {};
