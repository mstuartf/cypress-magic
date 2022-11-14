import { ParsedEvent } from "./events";
import { AliasBuilder } from "../utils/aliases";

export type SaveEvent = (event: ParsedEvent) => void;

export type OnCloseCallback = () => void;
export type RegisterOnCloseCallback = (fn: OnCloseCallback) => void;

export type NestedOption = number | boolean | string | NestedObj;

export interface NestedObj {
  [key: string]: NestedOption | Array<NestedOption>;
}

export interface EventManager {
  saveEvent: SaveEvent;
  close: () => void;
}

export type Fixture = any;
export type SaveFixture = (name: string, value: Fixture) => void;

export type InitArgs = {
  saveFixture: SaveFixture;
  buildAlias: AliasBuilder;
  saveEvent: SaveEvent;
  // this provides a way to tell listeners to stop listening when the sockets connection closes
  registerOnCloseCallback: RegisterOnCloseCallback;
};

export interface TDWindow extends Window {
  TD_CLIENT_ID: string;
  TD_DOMAINS: string[];
  TD_SOCKET_URL?: string;
  TD_BLOCK_UPLOAD?: boolean;
  Cypress: any;
}
