export interface BaseEvent {
  type: string;
  timestamp: number;
}

export interface NavigationEvent extends BaseEvent {
  hostname: string;
  protocol: string;
  pathname: string;
}

export interface PerformanceResourceEvent extends BaseEvent {
  resources: {
    name: PerformanceResourceTiming["name"];
    initiatorType: PerformanceResourceTiming["initiatorType"];
  }[];
}

export interface RequestEvent extends BaseEvent {
  url: string;
  method: string;
  initiator: "xml" | "fetch";
}

export interface ResponseEvent extends BaseEvent {
  url: string;
  method: string;
  status: number;
  alias: string;
  fixture: string | null;
}

export interface DomPathNode {
  nodeName: string;
  siblingCount: number;
  siblingIndex: number;
  id: string;
  dataCy: string;
  dataTestId: string;
}

export interface Target {
  selectors: string[][]; // todo: remove
  tag: string; // todo: remove
  isHidden: boolean;
  type: string;
  domPath: DomPathNode[];
}

export interface TargetEvent {
  target: Target;
  pathname: string;
}

export interface DragDropEvent extends BaseEvent, TargetEvent {
  destination: {
    clientX: number;
    clientY: number;
  };
}

export interface ChangeEvent extends BaseEvent, TargetEvent {
  value: any;
}

export interface UploadEvent extends BaseEvent, TargetEvent {
  mimeType: string;
  fileName: string;
}

export interface ClickEvent extends BaseEvent, TargetEvent {
  offsetX: number;
  offsetY: number;
  href?: string;
}

export interface ErrorEvent extends BaseEvent {
  handler: string;
  message: string;
}

export interface SubmitEvent extends BaseEvent, TargetEvent {}

export interface ViewEvent extends BaseEvent {
  width: number;
  height: number;
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
  isLandscape: boolean;
}

export type UserEvent =
  | ChangeEvent
  | ClickEvent
  | SubmitEvent
  | DragDropEvent
  | UploadEvent;

export interface StorageEvent extends BaseEvent {
  fixture: string;
  storageType: "local" | "session" | "cookie";
}

export type ParsedEvent =
  | UserEvent
  | NavigationEvent
  | RequestEvent
  | ResponseEvent
  | ViewEvent
  | StorageEvent
  | PerformanceResourceEvent
  | ErrorEvent;

export enum EventType {
  CLICK = "click",
  CHANGE = "change",
  DBLCLICK = "dblclick",
  SUBMIT = "submit",
  DRAGEND = "dragend",
}
