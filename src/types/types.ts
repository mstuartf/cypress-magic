import { ParsedEvent } from "./events";

export type SaveEvent = (event: ParsedEvent) => void;
export type RegisterOnSave = (fn: OnSaveCallback) => void;

export type NestedOption = number | boolean | string | NestedObj;

export interface NestedObj {
  [key: string]: NestedOption | Array<NestedOption>;
}

export type ObfuscateFn = (v: NestedOption | Array<NestedOption>) => any;

export type OnSaveCallback = (saveEventFn: SaveEvent) => void;

export interface EventManager {
  saveEvent: SaveEvent;
  registerOnSave: RegisterOnSave;
}

export interface PrivacyManager {
  obfuscate: ObfuscateFn;
  removeStateData: (val: string) => string;
}

export type InitArgs = EventManager & PrivacyManager;

export interface TDWindow extends Window {
  TD_CLIENT_ID: string;
  TD_DOMAINS: string[];
  TD_SOCKET_URL?: string;
  TD_BLOCK_UPLOAD?: boolean;
  Cypress: any;
}
