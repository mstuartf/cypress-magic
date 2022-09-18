import { v4 as uuidv4 } from "uuid";

export const readSessionId = () => uuidv4();
export const readClientId = () => (window as any).TD_CLIENT_ID as string;
export const readDomains = () => (window as any).TD_DOMAINS || ([] as string[]);
