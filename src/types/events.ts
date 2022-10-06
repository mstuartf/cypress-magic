export interface BaseEvent {
  type: string;
  timestamp: number;
}

export interface NavigationEvent extends BaseEvent {
  url?: string | URL;
  delta?: number;
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
}

export interface ResponseEvent extends BaseEvent {
  url: string;
  method: string;
  status: number;
  body: any;
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
  tag: string;
  isHidden: boolean;
  type: string;
  domPath: DomPathNode[];
}

export interface TargetEvent {
  target: Target;
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
  data: any;
  mimeType: string;
  fileName: string;
}

export interface ClickEvent extends BaseEvent, TargetEvent {
  offsetX: number;
  offsetY: number;
  href?: string;
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
  value: any;
}

export type ParsedEvent =
  | UserEvent
  | NavigationEvent
  | RequestEvent
  | ResponseEvent
  | ViewEvent
  | StorageEvent
  | PerformanceResourceEvent;

export enum EventType {
  CLICK = "click",
  CHANGE = "change",
  DBLCLICK = "dblclick",
  SUBMIT = "submit",
  DRAGEND = "dragend",
}
