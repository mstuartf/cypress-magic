import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ParsedEvent, UserEvent } from "../../plugin/types";
import { saveEvent } from "./redux/slice";
import initialize from "../../plugin/initialize";
import Resizer from "./Resizer";
import { widgetId } from "./constants";
import RecordingInProgress from "./RecordingInProgress";

function App() {
  const dispatch = useDispatch();
  const [recordingInProgress, setRecordingInProgress] = useState(false);

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

  return (
    <Resizer>
      <div className="flex justify-center">
        <div className="pt-6" style={{ width: "328px" }}>
          {recordingInProgress ? (
            <RecordingInProgress />
          ) : (
            <div className="grid">
              <button
                onClick={() => setRecordingInProgress(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Start recording
              </button>
            </div>
          )}
        </div>
      </div>
    </Resizer>
  );
}

export default App;
