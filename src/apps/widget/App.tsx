import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ParsedEvent, UserEvent } from "../../plugin/types";
import {
  saveEvent,
  setHasRefreshed,
  setRecordingInProgress,
} from "./redux/slice";
import initialize from "../../plugin/initialize";
import Resizer from "./Resizer";
import { widgetId } from "./constants";
import { selectRecordingInProgress } from "./redux/selectors";
import { readCache } from "./cache";
import RecordingInProgress from "./RecordingInProgress";
import Setup from "./Setup";

function App() {
  const dispatch = useDispatch();
  const recordingInProgress = useSelector(selectRecordingInProgress);

  useEffect(() => {
    const { recordingInProgress } = readCache();
    dispatch(setRecordingInProgress(recordingInProgress));
    if (recordingInProgress) {
      dispatch(setHasRefreshed(true));
    }
  }, []);

  const saveEventCallback = (event: ParsedEvent) => {
    if ((event as UserEvent).target?.domPath) {
      const inWidget = (event as UserEvent).target?.domPath.find(
        ({ id }) => id === widgetId
      );
      if (inWidget) {
        return;
      }
    }
    dispatch(saveEvent(event));
  };

  useEffect(() => {
    initialize({
      saveEvent: saveEventCallback,
      saveFixture: () => {},
      buildAlias: () => "abc123",
      registerOnCloseCallback: () => {},
    });
  }, []);

  if (recordingInProgress === undefined) {
    return null;
  }

  return (
    <Resizer>
      <div className="flex justify-center">
        <div className="pt-6" style={{ width: "328px" }}>
          {recordingInProgress ? <RecordingInProgress /> : <Setup />}
        </div>
      </div>
    </Resizer>
  );
}

export default App;
