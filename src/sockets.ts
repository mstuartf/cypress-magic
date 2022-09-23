import { ParsedEvent } from "./types";
import { readBlockUpload, readClientId, readSocketUrl } from "./globals";
import { version } from "../package.json";

export const createWsClient = () => {
  const url = readSocketUrl();
  const blockUpload = readBlockUpload();
  const clientId = readClientId();
  const domain = window.location.hostname;

  const ws = new WebSocket(url);
  let sessionId: string | undefined;

  let queue: ParsedEvent[] = [];

  ws.onclose = function () {
    console.error("Chat socket closed");
  };

  ws.onmessage = function (msg: MessageEvent) {
    const data = JSON.parse(msg.data);
    if (data.session_id) {
      sessionId = data.session_id;
      console.log("session id set");
      uploadQueue();
    }
  };

  ws.onopen = function () {
    ws.send(
      JSON.stringify({
        clientId,
        domain,
        version,
      })
    );
  };

  const sendWithSessionId = (event: ParsedEvent) => {
    if (blockUpload) {
      console.log("not uploading", event);
      return;
    }
    ws.send(
      JSON.stringify({
        sessionId,
        event,
      })
    );
  };

  const uploadQueue = () => {
    queue.forEach((event) => sendWithSessionId(event));
    queue = [];
  };

  const sendEvent = (event: ParsedEvent) => {
    queue.push(event);
    if (sessionId) {
      uploadQueue();
    }
  };

  return { sendEvent };
};
