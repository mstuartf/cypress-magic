import { EventManager, ParsedEvent } from "../types";

export const createWsClient = (clientId: string): EventManager => {
  // const ws = new WebSocket("wss://api.seasmoke.io/ws/events/");
  let sessionId: string | undefined;
  let index: number = 0;

  let queue: ParsedEvent[] = [];

  const saveEvent = (event: ParsedEvent) => {
    queue.push(event);
  };

  const close = (): string => {
    return sessionId!;
  };

  return {
    close,
    saveEvent,
  };
};
