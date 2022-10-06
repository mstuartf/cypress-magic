import { ParsedEvent } from "./events";

export type SaveEvent = (event: ParsedEvent) => void;
export type RegisterOnShutDown = (fn: () => void) => void;

export type NestedOption = number | boolean | string | NestedObj;

export interface NestedObj {
  [key: string]: NestedOption | Array<NestedOption>;
}

export type ObfuscateFn = (v: NestedOption | Array<NestedOption>) => any;

export interface EventManager {
  saveEvent: SaveEvent;
}

export interface PrivacyManager {
  obfuscate: ObfuscateFn;
}

export type InitArgs = EventManager & PrivacyManager;

export interface TDWindow extends Window {
  TD_CLIENT_ID: string;
  TD_DOMAINS: string[];
  TD_SOCKET_URL?: string;
  TD_BLOCK_UPLOAD?: boolean;
  Cypress: any;
}
