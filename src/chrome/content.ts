import {
  saveFixture,
  saveSession,
  startRecording,
  stopRecording,
} from "../redux/slice";

// manage a separate cache here because passing messages around reload is unreliable
const CONTENT_KEY = "__ss_content";
const setClientId = async (client_id: string | null): Promise<void> =>
  chrome.storage.local.set({ [CONTENT_KEY]: { client_id } });
const getClientId = async (): Promise<string> =>
  chrome.storage.local
    .get(CONTENT_KEY)
    .then((items) => items[CONTENT_KEY]?.client_id);

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
  if (request.type === startRecording.type) {
    setClientId(request.payload.client_id).then(() => {
      window.location.reload();
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
  getClientId().then((client_id) => {
    if (!client_id) {
      return;
    }
    setClientId(null).then(() => {
      window.postMessage({
        type: startRecording.type,
        payload: { client_id },
      });
    });
  });
};

onLoad();

export default {};
