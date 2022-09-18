import { ParsedEvent } from "./events";

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
