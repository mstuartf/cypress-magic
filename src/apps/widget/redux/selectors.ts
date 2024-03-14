import { RootState } from "./store";

export const selectEvents = (state: RootState) => state.root.events;
export const selectDisplayEvents = (state: RootState) =>
  selectEvents(state).slice(-3);