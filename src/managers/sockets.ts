import {
  EventManager,
  OnCloseCallback,
  OnSaveEventCallback,
  ParsedEvent,
} from "../types";
import { readBlockUpload, readSocketUrl } from "../globals";
import { version } from "../../package.json";

export const createWsClient = (
  clientId: string,
  devMode = false
): EventManager => {
  const url = readSocketUrl();
  const blockUpload = readBlockUpload();
  const domain = window.location.hostname;

  const ws = new WebSocket(url);
  let sessionId: string | undefined;
  let index: number = 0;

  let queue: ParsedEvent[] = [];

  const onCloseCallbacks: OnCloseCallback[] = [];
  const onSendEventCallbacks: OnSaveEventCallback[] = [];
  const registerOnCloseCallback = (fn: OnCloseCallback) => {
    onCloseCallbacks.push(fn);
  };
  const registerOnSaveEventCallback = (fn: OnSaveEventCallback) => {
    onSendEventCallbacks.push(fn);
  };

  ws.onclose = function () {
    console.log("Chat socket closed");
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
        dev: devMode,
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
      onSendEventCallbacks.forEach((fn) => fn(event));
    }
  };

  const close = (): string => {
    ws.close();
    return sessionId;
  };

  return {
    saveEvent,
    registerOnCloseCallback,
    close,
    registerOnSaveEventCallback,
  };
};
