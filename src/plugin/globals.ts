import { TDWindow } from "./types";

const w = window as unknown as TDWindow;
const SOCKET_URL = "wss://api.seasmoke.io/ws/events/";

export const readClientId = (): string => w.TD_CLIENT_ID as string;
export const readSocketUrl = (): string => w.TD_SOCKET_URL || SOCKET_URL;
export const readBlockUpload = (): boolean => w.TD_BLOCK_UPLOAD || false;
export const readIsTestMode = (): boolean => w.Cypress !== undefined;
