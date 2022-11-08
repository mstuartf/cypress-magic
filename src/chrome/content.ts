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

chrome.storage.sync.get(["forceReload", "client_id"], function (items) {
  const { forceReload, client_id } = items;
  if (forceReload) {
    chrome.storage.sync.set({ forceReload: false }, function () {
      console.log("sending start message to inject");
      window.postMessage({
        type: "user/startRecording",
        payload: { client_id },
      });
    });
  }
});

export default {};
