import { WidgetRootState } from "./redux/store";

const cacheKey = "__widgetCache__";

export const readCache = <T>(slice: string): T | null => {
  const raw = localStorage.getItem(cacheKey);

  if (!raw) {
    return null;
  }

  const parsed = JSON.parse(raw) as { [key: string]: T };

  if (!parsed.hasOwnProperty(slice)) {
    return null;
  }

  return parsed[slice];
};

export const setCache = (state: WidgetRootState) => {
  localStorage.setItem(cacheKey, JSON.stringify(state));
};
