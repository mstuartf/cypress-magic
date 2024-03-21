import { useDispatch, useSelector } from "react-redux";
import {
  selectEvent,
  selectEventIdsSorted,
  selectIsRunningResponses,
  selectIsRunningStep,
  selectIsRunningStepIncrementOnLoad,
  selectRunOptions,
} from "./redux/selectors";
import { useEffect, useState } from "react";
import {
  scheduleUpdateRunStep,
  setIsRunning,
  updateRunStep,
} from "./redux/slice";
import { run } from "./runner";
import {
  isNavigationEvent,
  isPageRefreshEvent,
  isResponseEvent,
} from "./utils";

const TestRunner = () => {
  const dispatch = useDispatch();
  const step = useSelector(selectIsRunningStep);
  const incrementOnLoad = useSelector(selectIsRunningStepIncrementOnLoad);
  const eventIds = useSelector(selectEventIdsSorted);
  const event = useSelector(selectEvent(eventIds[step]));
  const runOptions = useSelector(selectRunOptions);
  const responses = useSelector(selectIsRunningResponses);

  useEffect(() => {
    if (incrementOnLoad) {
      dispatch(updateRunStep());
    }
  }, []);

  useEffect(() => {
    if (incrementOnLoad) {
      return;
    }
    if (
      !!event &&
      isResponseEvent(event) &&
      !responses.find(({ alias }) => alias === event.alias)
    ) {
      console.log("do noting because response has not been received");
      return;
    }
    if (step < eventIds.length) {
      setTimeout(() => {
        if (isNavigationEvent(event) || isPageRefreshEvent(event)) {
          dispatch(scheduleUpdateRunStep());
          run(event, runOptions);
        } else {
          run(event, runOptions);
          dispatch(updateRunStep());
        }
      }, 500);
    } else {
      dispatch(setIsRunning(false));
    }
  }, [event, incrementOnLoad, responses]);

  return null;
};

export default TestRunner;
