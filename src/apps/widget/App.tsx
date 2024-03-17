import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBaseUrl,
  setHasRefreshed,
  setRecordingInProgress,
} from "./redux/slice";
import Resizer from "./Resizer";
import { selectRecordingInProgress } from "./redux/selectors";
import { readCache } from "./cache";
import RecordingInProgress from "./RecordingInProgress";
import Setup from "./Setup";

function App() {
  const dispatch = useDispatch();
  const recordingInProgress = useSelector(selectRecordingInProgress);

  useEffect(() => {
    const { recordingInProgress, baseUrl } = readCache();
    dispatch(setRecordingInProgress(recordingInProgress));
    dispatch(setBaseUrl(baseUrl));
    if (recordingInProgress) {
      dispatch(setHasRefreshed(true));
    }
  }, []);

  if (recordingInProgress === undefined) {
    return null;
  }

  return (
    <Resizer>
      {recordingInProgress ? <RecordingInProgress /> : <Setup />}
    </Resizer>
  );
}

export default App;
