export interface ParsedEvent {
  selectors: string[][];
  type: string;
  tag: string;
  value: string;
  id?: string;
  key?: string;
  href?: string;
  inputType?: string;
  innerText?: string;
  timestamp: number;
  classList: DOMTokenList;
  offsetX?: number;
  offsetY?: number;
}

export enum EventType {
  CLICK = "click",
  CHANGE = "change",
  DBLCLICK = "dblclick",
  SUBMIT = "submit",
}
