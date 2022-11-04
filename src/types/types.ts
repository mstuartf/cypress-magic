import { ParsedEvent } from "./events";

export type SaveEvent = (event: ParsedEvent) => void;

export type OnCloseCallback = () => void;
export type RegisterOnCloseCallback = (fn: OnCloseCallback) => void;

export type NestedOption = number | boolean | string | NestedObj;

export interface NestedObj {
  [key: string]: NestedOption | Array<NestedOption>;
}

export type ObfuscateFn = (v: NestedOption | Array<NestedOption>) => any;

export interface EventManager {
  saveEvent: SaveEvent;
  // this provides a way to tell listeners to stop listening when the sockets connection closes
  registerOnCloseCallback: RegisterOnCloseCallback;
  close: () => void;
}

export interface PrivacyManager {
  obfuscate: ObfuscateFn;
  clear: () => void;
}

export type InitArgs = Omit<EventManager, "close"> &
  Omit<PrivacyManager, "clear">;

export interface TDWindow extends Window {
  TD_CLIENT_ID: string;
  TD_DOMAINS: string[];
  TD_SOCKET_URL?: string;
  TD_BLOCK_UPLOAD?: boolean;
  Cypress: any;
}
