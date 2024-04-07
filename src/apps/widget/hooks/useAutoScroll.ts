import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectEventIdsSorted,
  selectIsRunningEventId,
  selectRunError,
} from "../redux/selectors";

export const useAutoScroll = () => {
  const ref = useRef<HTMLDivElement>(null);

  const eventIds = useSelector(selectEventIdsSorted);
  const isRunningEventId = useSelector(selectIsRunningEventId);
  const runError = useSelector(selectRunError);

  const [localEventIds, setLocalEventIds] = useState<string[]>([]);
  const [localIsRunningEventId, setLocalIsRunningEventId] = useState<
    string | undefined
  >();
  const [localRunError, setLocalRunError] = useState<
    { title: string; message: string } | undefined
  >();

  useEffect(() => {
    if (
      // a new event has been added
      eventIds.length > localEventIds.length ||
      // run step has incremented
      (isRunningEventId &&
        (!localIsRunningEventId ||
          eventIds.indexOf(isRunningEventId) >
            eventIds.indexOf(localIsRunningEventId))) ||
      // there is an event error
      (!localRunError && !!runError)
    ) {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }
    setLocalEventIds(eventIds);
    setLocalRunError(runError);
    setLocalIsRunningEventId(isRunningEventId);
  }, [eventIds, isRunningEventId, runError]);

  return ref;
};
