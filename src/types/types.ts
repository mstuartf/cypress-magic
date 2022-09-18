import { TextNode } from "diff-dom";

export interface EventMeta {
  clientId: string;
  sessionId: string;
  domain: string;
}

export interface BaseEvent {
  type: string;
  timestamp: number;
}

export interface NavigationEvent extends BaseEvent {
  url?: string | URL;
  delta?: number;
}

export interface RequestEvent extends BaseEvent {
  url: string;
  method: string;
}

export interface ResponseEvent extends BaseEvent {
  url: string;
  method: string;
  status: number;
  body: any;
}

export interface TargetEvent extends BaseEvent {
  selectors: string[][];
  tag: string;
  classList: DOMTokenList;
  id: string;
}

export interface ChangeEvent extends TargetEvent {
  inputType: string;
  value: any;
}

export interface ClickEvent extends TargetEvent {
  offsetX: number;
  offsetY: number;
  innerText: string;
  href?: string;
}

export interface SubmitEvent extends TargetEvent {}

export interface ViewEvent extends BaseEvent {
  width: number;
  height: number;
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
  isLandscape: boolean;
}

export type UserEvent = ChangeEvent | ClickEvent | SubmitEvent;

export interface DiffEvent extends BaseEvent {
  diff: TextNode[];
}

export interface StorageEvent extends BaseEvent {
  value: any;
}

export type ParsedEvent =
  | UserEvent
  | NavigationEvent
  | RequestEvent
  | ResponseEvent
  | ViewEvent
  | DiffEvent
  | StorageEvent;

export enum EventType {
  CLICK = "click",
  CHANGE = "change",
  DBLCLICK = "dblclick",
  SUBMIT = "submit",
}

export type SaveEvent = (event: ParsedEvent) => void;

export type NestedOption = number | boolean | string | NestedObj;

export interface NestedObj {
  [key: string]: NestedOption | Array<NestedOption>;
}

export type ObfuscateFn = (v: NestedOption | Array<NestedOption>) => any;

export interface InitArgs {
  saveEvent: SaveEvent;
  obfuscate: ObfuscateFn;
  removeStateData: (val: string) => string;
}