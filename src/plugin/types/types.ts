import { ParsedEvent } from "./events";
import { AliasBuilder } from "../utils/aliases";

export type SaveEvent = (event: ParsedEvent) => void;

export type OnCloseCallback = () => void;
export type OnSaveEventCallback = SaveEvent;
export type RegisterOnCloseCallback = (fn: OnCloseCallback) => void;
export type RegisterOnSaveEventCallback = (fn: OnSaveEventCallback) => void;

export type NestedOption = number | boolean | string | NestedObj;

export interface NestedObj {
  [key: string]: NestedOption | Array<NestedOption>;
}

export type ObfuscateFn = (v: NestedOption | Array<NestedOption>) => any;

export interface EventManager {
  saveEvent: SaveEvent;
  // this provides a way to tell listeners to stop listening when the sockets connection closes
  registerOnCloseCallback: RegisterOnCloseCallback;
  // this provides a way for listeners to know when other listeners have saved events
  // (useful for things like cookies that don't have in build change handlers)
  registerOnSaveEventCallback: RegisterOnSaveEventCallback;
  close: () => string;
}

export interface PrivacyManager {
  obfuscate: ObfuscateFn;
  clear: () => void;
}

export type Fixture = any;
export type SaveFixture = (name: string, value: Fixture) => void;

export type InitArgs = Omit<EventManager, "close"> &
  Omit<PrivacyManager, "clear"> & {
    saveFixture: SaveFixture;
    buildAlias: AliasBuilder;
  };

export interface TDWindow extends Window {
  TD_CLIENT_ID: string;
  TD_DOMAINS: string[];
  TD_SOCKET_URL?: string;
  TD_BLOCK_UPLOAD?: boolean;
  Cypress: any;
}
