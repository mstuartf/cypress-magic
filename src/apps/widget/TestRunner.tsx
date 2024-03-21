import { useDispatch, useSelector } from "react-redux";
import {
  selectEvent,
  selectEventIdsSorted,
  selectIsRunningStep,
  selectRunOptions,
} from "./redux/selectors";
import { useEffect, useState } from "react";
import { setIsRunning, updateRunStep } from "./redux/slice";
import { run } from "./runner";

const TestRunner = () => {
  const dispatch = useDispatch();
  const step = useSelector(selectIsRunningStep);
  const eventIds = useSelector(selectEventIdsSorted);
  const event = useSelector(selectEvent(eventIds[step]));
  const runOptions = useSelector(selectRunOptions);

  // this is local state so it will be reset to false on navigation / reload
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    if (!executing) {
      setExecuting(true);
      setTimeout(() => {
        if (step < eventIds.length - 1) {
          dispatch(updateRunStep());
        } else {
          dispatch(setIsRunning(false));
        }
        run(event, runOptions);
        setExecuting(false);
      }, 500);
    }
  }, [event, executing]);

  return null;
};

export default TestRunner;
