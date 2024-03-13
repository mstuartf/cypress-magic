import { RootState } from "./store";

export const selectCacheLoaded = (state: RootState) => state.root.cacheLoaded;
export const selectIsActive = (state: RootState) => state.root.isActive;
export const selectEvents = (state: RootState) => state.root.events;
export const selectDisplayEvents = (state: RootState) =>
  selectEvents(state).slice(-3);
