import { RootState } from "./store";

export const selectCacheLoaded = (state: RootState) => state.root.cacheLoaded;
export const selectIsRecording = (state: RootState) =>
  state.root.recording.inProgress;
