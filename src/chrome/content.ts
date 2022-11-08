chrome.runtime.onMessage.addListener(function (request) {
  if (!request) {
    return;
  }
  if (request.type === "user/startRecording") {
    chrome.storage.sync.set(
      { forceReload: true, client_id: request.payload.client_id },
      function () {
        window.location.reload();
      }
    );
  }
  if (request.type === "user/stopRecording") {
    window.postMessage({
      type: request.type,
    });
  }
});

window.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) {
    return;
  }
  if (event.data.type === "user/saveSession") {
    console.log(`save session from content: ${event.data.payload.session_id}`);
    chrome.runtime.sendMessage({
      type: "user/saveSession",
      payload: { session_id: event.data.payload.session_id },
    });
  }
});

chrome.storage.sync.get(["forceReload", "client_id"], function (items) {
  const { forceReload, client_id } = items;
  if (forceReload) {
    chrome.storage.sync.set({ forceReload: false }, function () {
      window.postMessage({
        type: "user/startRecording",
        payload: { client_id },
      });
    });
  }
});

export default {};
