import { InitArgs, NavigationEvent } from "../types";
import { generateEventId } from "../utils/generateEventId";
import { getPathAndHost } from "./history";

const getBaseEvent = (): NavigationEvent => ({
  id: generateEventId(),
  type: "navigation",
  timestamp: Date.now(),
  ...getPathAndHost(new URL(window.location.href)),
});

export const initNavigationObserver = ({ saveEvent }: InitArgs) => {
  const cached: PerformanceNavigationTiming[] = [];
  const observer = new PerformanceObserver((list) => {
    const lastEntry = (
      list.getEntriesByType("navigation") as PerformanceNavigationTiming[]
    )[0];
    // todo: filter by initiator to ignore refresh after form?
    if (!cached.includes(lastEntry)) {
      saveEvent({
        ...getBaseEvent(),
      });
      cached.push(lastEntry);
    }
  });
  observer.observe({ type: "navigation", buffered: true });
};
