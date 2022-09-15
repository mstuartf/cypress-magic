export const readClientId = () => (window as any).TD_CLIENT_ID as string;
export const readDomains = () => (window as any).TD_DOMAINS || ([] as string[]);
