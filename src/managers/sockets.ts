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

  (window as any).REMOVE_SOCKET = ws;

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

  const saveEvent = (event: ParsedEvent) => {
    queue.push(event);
    if (sessionId) {
      uploadQueue();
    }
  };

  return { saveEvent, registerOnCloseCallback };
};
