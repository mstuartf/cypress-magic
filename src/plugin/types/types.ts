import { ParsedEvent } from "./events";
import { AliasBuilder } from "../utils/aliases";

export type SaveEvent = (event: ParsedEvent) => void;

export type NestedOption = number | boolean | string | NestedObj;

export interface NestedObj {
  [key: string]: NestedOption | Array<NestedOption>;
}

export type SaveFixture = (name: string, value: Blob) => void;

export type InitArgs = {
  saveFixture: SaveFixture;
  buildAlias: AliasBuilder;
  saveEvent: SaveEvent;
};
