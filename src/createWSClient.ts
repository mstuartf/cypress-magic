import { ParsedEvent } from "./types";

const SOCKET_URL = "ws://0.0.0.0:1337/ws/events/";

export const createWsClient = () => {
  const ws = new WebSocket(SOCKET_URL);

  ws.onclose = function (e) {
    console.error("Chat socket closed unexpectedly");
  };

  const send = (p: string) => {
    if (ws.readyState === 1) {
      ws.send(p);
    } else {
      setTimeout(() => {
        send(p);
      }, 1000);
    }
  };

  const sendEvent = (
    clientId: string,
    sessionId: string,
    event: ParsedEvent
  ) => {
    send(
      JSON.stringify({
        clientId,
        sessionId,
        event: event,
      })
    );
  };

  return { sendEvent };
};
