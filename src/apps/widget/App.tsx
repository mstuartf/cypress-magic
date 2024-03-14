import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ParsedEvent, UserEvent } from "../../plugin/types";
import { saveEvent, setRecordingInProgress } from "./redux/slice";
import initialize from "../../plugin/initialize";
import Resizer from "./Resizer";
import { widgetId } from "./constants";
import InnerApp from "./InnerApp";
import { selectRecordingInProgress } from "./redux/selectors";

const readCache = (): boolean =>
  localStorage.getItem("__seasmoke__") === "true";

function App() {
  const dispatch = useDispatch();
  const recordingInProgress = useSelector(selectRecordingInProgress);

  const startRecording = () => {
    dispatch(setRecordingInProgress(true));
  };

  useEffect(() => {
    dispatch(setRecordingInProgress(readCache()));
  }, []);

  const saveEventCallback = (event: ParsedEvent) => {
    if (!recordingInProgress) {
      return;
    }
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
          <InnerApp
            recordingInProgress={recordingInProgress}
            startRecording={startRecording}
          />
        </div>
      </div>
    </Resizer>
  );
}

export default App;
