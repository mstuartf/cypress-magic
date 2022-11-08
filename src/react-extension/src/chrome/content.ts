chrome.runtime.onMessage.addListener(function (request) {
  if (!request) {
    return;
  }
  window.postMessage({
    type: request.type,
    payload: request.payload,
  });
});

export default {};
