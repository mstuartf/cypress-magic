import { Payload } from "./types";

const SOCKET_URL = "wss://api.testdetector.com/ws/events/";

export const createWsClient = () => {
  const ws = new WebSocket(SOCKET_URL);

  const queue: Payload[] = [];

  ws.onopen = function () {
    uploadQueue();
  };

  ws.onclose = function () {
    console.error("Chat socket closed unexpectedly");
  };

  const send = (payload: Payload) => {
    ws.send(
      JSON.stringify({
        ...payload,
      })
    );
  };

  const uploadQueue = () => {
    queue.forEach((event) => send(event));
  };

  const sendEvent = (payload: Payload) => {
    queue.push(payload);
    if (ws.readyState === 1) {
      uploadQueue();
    }
  };

  return { sendEvent };
};
