import { RootState } from "./store";

export const selectCacheLoaded = (state: RootState) => state.root.cacheLoaded;
export const selectIsActive = (state: RootState) => state.root.isActive;
