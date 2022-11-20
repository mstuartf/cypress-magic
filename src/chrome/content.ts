import {
  saveEvent,
  saveFixture,
  startRecording,
  stopRecording,
  updateAliases,
} from "../redux/slice";
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
  if (event.data.type === saveFixture.type) {
    chrome.runtime.sendMessage({
      type: saveFixture.type,
      payload: {
        name: event.data.payload.name,
        value: event.data.payload.value,
      },
    });
  }
  if (event.data.type === saveEvent.type) {
    chrome.runtime.sendMessage({
      type: saveEvent.type,
      payload: event.data.payload,
    });
  }
  if (event.data.type === updateAliases.type) {
    chrome.runtime.sendMessage({
      type: updateAliases.type,
      payload: event.data.payload,
    });
  }
});

readCache(
  ({
    user: {
      recording: { inProgress, aliases },
    },
  }) => {
    if (inProgress) {
      window.postMessage({
        type: startRecording.type,
        payload: { aliases },
      });
    }
  }
);

export default {};
