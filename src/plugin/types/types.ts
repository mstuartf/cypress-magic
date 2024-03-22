import { ParsedEvent } from "./events";
import { AliasBuilder } from "../utils/aliases";
import { PickledBlob } from "../utils/pickleBlob";

export type SaveEvent = (event: ParsedEvent) => void;

export type NestedOption = number | boolean | string | NestedObj;

export interface NestedObj {
  [key: string]: NestedOption | Array<NestedOption>;
}

export type SaveFixture = (name: string, pickle: PickledBlob) => void;

export type InitArgs = {
  saveFixture: SaveFixture;
  buildAlias: AliasBuilder;
  saveEvent: SaveEvent;
  mockApiCalls: () => boolean;
  matchUrl: (url: string) => boolean;
  getMockedResponse: (alias: string) => {
    status: number;
    statusText: string;
    content: PickledBlob;
  };
};
