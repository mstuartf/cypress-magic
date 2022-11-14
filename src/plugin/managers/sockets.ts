import { EventManager, ParsedEvent } from "../types";

export const createWsClient = (clientId: string): EventManager => {
  const ws = new WebSocket("wss://api.seasmoke.io/ws/events/");
  let sessionId: string | undefined;
  let index: number = 0;

  let queue: ParsedEvent[] = [];

  ws.onclose = function () {
    sessionId = undefined;
    // todo: dispatch closed action here
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
        domain: "chrome-extension",
        version: "react",
        dev: true,
      })
    );
  };

  const sendWithSessionId = (event: ParsedEvent) => {
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

  const close = (): string => {
    ws.close();
    return sessionId!;
  };

  return {
    close,
    saveEvent,
  };
};
