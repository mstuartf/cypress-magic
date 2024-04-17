import { useDispatch, useSelector } from "react-redux";
import { selectFirstNavEvent, selectMissedRequests } from "../redux/selectors";
import { useEffect } from "react";
import { appName } from "../../popup/components/Main";
import { setMissedRequests } from "../redux/slice";

const MissedRequests = () => {
  const { timestamp } = useSelector(selectFirstNavEvent)!;
  const dispatch = useDispatch();
  const missedRequests = useSelector(selectMissedRequests);

  const saveRequests = () =>
    dispatch(
      setMissedRequests([
        ...missedRequests,
        ...window.performance
          .getEntriesByType("resource")
          .filter((e): e is PerformanceResourceTiming => true)
          .filter(({ initiatorType }) =>
            ["fetch", "xmlhttprequest"].includes(initiatorType)
          )
          .filter(
            ({ fetchStart }) =>
              fetchStart + window.performance.timeOrigin <= timestamp
          )
          .map(({ name }) => name),
      ])
    );

  useEffect(() => {
    saveRequests();
    const _observer = new PerformanceObserver((list) => saveRequests());
    _observer.observe({ entryTypes: ["resource"] });
    return () => _observer.disconnect();
  }, []);

  if (!missedRequests.length) {
    return null;
  }

  return (
    <div className="cyw-ml-8 cyw-grid cyw-gap-2 cyw-grid-cols-1">
      <div className="cyw-break-keep">
        The following requests were sent before {appName} had initialised and
        could not be intercepted or stubbed:
      </div>
      <ul className="cyw-list-disc cyw-italic cyw-pl-2 cyw-mb-0">
        {missedRequests.map((req) => (
          <li key={req}>{req}</li>
        ))}
      </ul>
    </div>
  );
};

export default MissedRequests;
