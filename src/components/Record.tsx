import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  selectEmailAddress,
  selectIsLoggedIn,
  selectRecordingInProgress,
  selectSessionId,
  selectSessionUrl,
} from "../redux/selectors";
import {
  getSessionUrl,
  logout,
  startRecording,
  stopRecording,
} from "../redux/slice";

const sessionUrlRequest = async (
  session_id: string
): Promise<{ url: string }> => {
  const response = await fetch(
    `https://api.seasmoke.io/events/session/${session_id}/test-file`
  );
  const body = await response.json();
  return body;
};

const Record = () => {
  const email = useSelector(selectEmailAddress);
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const recordingInProgress = useSelector(selectRecordingInProgress);
  const sessionId = useSelector(selectSessionId);
  const sessionUrl = useSelector(selectSessionUrl);

  useEffect(() => {
    if (!!sessionId && !sessionUrl) {
      sessionUrlRequest(sessionId).then(({ url: session_url }) => {
        dispatch(getSessionUrl({ session_url }));
      });
    }
  }, [sessionId, sessionUrl]);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      Record
      <div>{sessionId}</div>
      <div>{email}</div>
      <button onClick={() => dispatch(logout())}>Logout</button>
      {recordingInProgress && <div>Recording...</div>}
      {!!sessionId && !sessionUrl && <div>Saving...</div>}
      {!!sessionUrl && (
        <a href={sessionUrl} download>
          Download file
        </a>
      )}
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
