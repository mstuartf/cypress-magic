import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHasRefreshed } from "./redux/slice";
import Resizer from "./Resizer";
import { selectRecordingInProgress } from "./redux/selectors";
import RecordingInProgress from "./RecordingInProgress";
import Setup from "./Setup";

function App() {
  const dispatch = useDispatch();
  const recordingInProgress = useSelector(selectRecordingInProgress);

  useEffect(() => {
    if (recordingInProgress) {
      dispatch(setHasRefreshed(true));
    }
  }, []);

  return (
    <Resizer>
      {recordingInProgress ? <RecordingInProgress /> : <Setup />}
    </Resizer>
  );
}

export default App;
