const SOCKET_URL = "wss://api.testdetector.com/ws/events/";

export const readClientId = () => (window as any).TD_CLIENT_ID as string;
export const readDomains = () => (window as any).TD_DOMAINS || ([] as string[]);
export const readSocketUrl = () => (window as any).TD_SOCKET_URL || SOCKET_URL;
