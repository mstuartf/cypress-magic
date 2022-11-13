import {
  saveSession,
  startRecording,
  stopRecording,
  saveFixture,
  pageLoadComplete,
} from "../redux/slice";

// send messages to inject script
chrome.runtime.onMessage.addListener(function (request) {
  if (!request) {
    return;
  }
  if (request.type === stopRecording.type) {
    window.postMessage({
      type: request.type,
    });
  }
});

// receive messages from inject script
window.addEventListener("message", (event) => {
  if (!event.data || !event.data.type) {
    return;
  }
  if (event.data.type === saveSession.type) {
    chrome.runtime.sendMessage({
      type: saveSession.type,
      payload: { session_id: event.data.payload.session_id },
    });
  }
  if (event.data.type === saveFixture.type) {
    chrome.runtime.sendMessage({
      type: saveFixture.type,
      payload: {
        name: event.data.payload.name,
        value: event.data.payload.value,
      },
    });
  }
});

const onLoad = () => {
  chrome.runtime
    .sendMessage({
      type: pageLoadComplete.type,
    })
    .then((client_id) => {
      if (client_id) {
        console.log("triggering start");
        window.postMessage({
          type: startRecording.type,
          payload: { client_id },
        });
      } else {
        console.log("NOT triggering start");
      }
    });
};

onLoad();

export default {};
