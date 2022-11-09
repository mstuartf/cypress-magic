import { saveSession, startRecording, stopRecording } from "../redux/slice";
import { readCache } from "./utils";

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
});

const onLoad = () => {
  readCache(
    ({
      user: {
        recording: { inProgress },
        info: { client_id },
      },
    }) => {
      if (inProgress) {
        console.log("dispathcing from conetnet");
        window.postMessage({
          type: startRecording.type,
          payload: { client_id },
        });
      }
    }
  );
};

onLoad();

export default {};
