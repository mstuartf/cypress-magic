import { EventManager, ParsedEvent, OnCloseCallback } from "../types";
import { readBlockUpload, readClientId, readSocketUrl } from "../globals";
import { version } from "../../package.json";

export const createWsClient = (): EventManager => {
  const url = readSocketUrl();
  const blockUpload = readBlockUpload();
  const clientId = readClientId();
  const domain = window.location.hostname;

  const ws = new WebSocket(url);
  let sessionId: string | undefined;
  let index: number = 0;

  let queue: ParsedEvent[] = [];

  const onCloseCallbacks: OnCloseCallback[] = [];

  const registerOnCloseCallback = (fn: OnCloseCallback) => {
    onCloseCallbacks.push(fn);
  };

  ws.onclose = function () {
    console.warn("Chat socket closed");
    sessionId = undefined;
    onCloseCallbacks.forEach((fn) => fn());
  };

  ws.onmessage = function (msg: MessageEvent) {
    const data = JSON.parse(msg.data);
    if (data.session_id) {
      sessionId = data.session_id;
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
        index,
      })
    );
    index++;
  };

  const uploadQueue = () => {
    queue.forEach((event) => sendWithSessionId(event));
    queue = [];
  };

  const saveEvent = (event: ParsedEvent) => {
    queue.push(event);
    if (sessionId) {
      uploadQueue();
    }
  };

  const close = () => {
    ws.close();
  };

  return { saveEvent, registerOnCloseCallback, close };
};
