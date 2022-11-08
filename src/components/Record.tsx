import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  selectEmailAddress,
  selectIsLoggedIn,
  selectRecordingInProgress,
  selectSessionId,
} from "../redux/selectors";
import { logout, startRecording, stopRecording } from "../redux/slice";

const Record = () => {
  const email = useSelector(selectEmailAddress);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const recordingInProgress = useSelector(selectRecordingInProgress);
  const sessionId = useSelector(selectSessionId);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      Record
      <div>{email}</div>
      <div>{sessionId}</div>
      <button onClick={() => dispatch(logout())}>Logout</button>
      <button
        onClick={() => {
          if (recordingInProgress) {
            dispatch(stopRecording());
          } else {
            dispatch(startRecording());
          }
        }}
      >
        {recordingInProgress ? "Stop recording" : "Start recording"}
      </button>
    </div>
  );
};

export default Record;
