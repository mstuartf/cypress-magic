import { TDWindow } from "./types";

const SOCKET_URL = "wss://api.seasmoke.io/ws/events/";
// const SOCKET_URL = "ws://0.0.0.0:1337/ws/events/";

const w = window as unknown as TDWindow;

export const readClientId = (): string => w.TD_CLIENT_ID as string;
export const readSocketUrl = (): string => w.TD_SOCKET_URL || SOCKET_URL;
export const readBlockUpload = (): boolean => w.TD_BLOCK_UPLOAD || false;
export const readIsTestMode = (): boolean => w.Cypress !== undefined;
