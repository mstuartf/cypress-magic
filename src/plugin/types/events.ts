export interface BaseEvent {
  type: string;
  timestamp: number;
  id: string;
}

export interface NavigationEvent extends HistoryEvent {}

export interface HistoryEvent extends BaseEvent {
  hostname: string;
  protocol: string;
  pathname: string;
  search: string;
  port: string;
}

export interface UrlChangeEvent extends HistoryEvent {
  urlDiff: string;
}

export interface QueryParamChangeEvent extends HistoryEvent {
  param: string;
  added?: string;
  removed?: string;
  changed?: string;
}

export interface PageRefreshEvent extends NavigationEvent {}

export interface RequestEvent extends BaseEvent {
  id: string;
  url: string;
  method: string;
  initiator: "XML" | "fetch";
  alias: string;
  fixture?: string;
  status?: number;
  triggerId?: string;
}

export interface ResponseEvent extends BaseEvent {
  requestId: string;
  url: string;
  method: string;
  status: number;
  statusText: string;
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
  type: string | null;
  domPath: DomPathNode[];
  innerText?: string;
  value?: string;
  placeholder?: string;
  checked?: boolean;
}

export interface TargetEvent {
  target: Target;
  pathname: string;
}

export interface ChangeEvent extends BaseEvent, TargetEvent {
  value: any;
}

export interface ClickEvent extends BaseEvent, TargetEvent {
  clientX: number;
  clientY: number;
  href?: string;
}

export interface DblClickEvent extends ClickEvent {}

export interface AssertionEvent extends ClickEvent {}

export interface ErrorEvent extends BaseEvent {
  handler: string;
  message: string;
}

export interface ViewEvent extends BaseEvent {
  width: number;
  height: number;
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
  isLandscape: boolean;
}

export type UserEvent = ChangeEvent | ClickEvent | DblClickEvent;

export type ParsedEvent =
  | UserEvent
  | HistoryEvent
  | RequestEvent
  | ResponseEvent
  | ViewEvent
  | ErrorEvent;

export enum EventType {
  CLICK = "click",
  CHANGE = "change",
  DBLCLICK = "dblclick",
}
