import { TextNodeWithRoute } from "../observers";

export interface EventMeta {
  clientId: string;
  domain: string;
  version: string;
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
  dataCy: string | null;
}

export interface DragDropEvent extends BaseEvent {
  target: {
    selectors: string[][];
    tag: string;
    classList: DOMTokenList;
    id: string;
  };
  destination: {
    clientX: number;
    clientY: number;
  };
}

export interface ChangeEvent extends TargetEvent {
  inputType: string;
  value: any;
}

export interface UploadEvent extends TargetEvent {
  data: any;
  mimeType: string;
  fileName: string;
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

export type UserEvent = ChangeEvent | ClickEvent | SubmitEvent | DragDropEvent;

export interface DiffEvent extends BaseEvent {
  diff: TextNodeWithRoute[];
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
  DRAGEND = "dragend",
}
