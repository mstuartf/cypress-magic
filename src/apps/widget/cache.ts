const cacheKey = "widgetCache";

export interface Cache {
  recordingInProgress: boolean;
  hasRefreshed: boolean;
  baseUrl: string | undefined;
}

export const readCache = (): Cache => {
  const raw = localStorage.getItem(cacheKey);
  return !!raw
    ? JSON.parse(raw)
    : {
        recordingInProgress: false,
        hasRefreshed: false,
        baseUrl: undefined,
      };
};

export const setCache = <T extends keyof Cache>(k: T, v: Cache[T]) => {
  const currentValue = readCache();
  currentValue[k] = v;
  localStorage.setItem(cacheKey, JSON.stringify(currentValue));
};
