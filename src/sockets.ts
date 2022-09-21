import { Payload } from "./types";
import { readSocketUrl } from "./globals";

export const createWsClient = () => {
  const url = readSocketUrl();
  const ws = new WebSocket(url);
  let sessionId: string | undefined;

  let queue: Payload[] = [];

  ws.onclose = function () {
    console.error("Chat socket closed unexpectedly");
  };

  ws.onmessage = function (msg: MessageEvent) {
    const data = JSON.parse(msg.data);
    if (data.session_id) {
      sessionId = data.session_id;
      console.log("session id set");
      uploadQueue();
    }
  };

  const sendWithSessionId = (payload: Payload) => {
    ws.send(
      JSON.stringify({
        sessionId,
        ...payload,
      })
    );
  };

  const uploadQueue = () => {
    queue.forEach((event) => sendWithSessionId(event));
    queue = [];
  };

  const sendEvent = (payload: Payload) => {
    queue.push(payload);
    if (ws.readyState === 1) {
      uploadQueue();
    }
  };

  return { sendEvent };
};
