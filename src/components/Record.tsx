import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  selectIsLoggedIn,
  selectLastRecordingAborted,
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
import Header from "./Header";
import Button from "./Button";
import Spinner from "./Spinner";
import Link from "./Link";
import GrayLinkButton from "./GrayLinkButton";

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
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const recordingInProgress = useSelector(selectRecordingInProgress);
  const lastAborted = useSelector(selectLastRecordingAborted);
  const sessionId = useSelector(selectSessionId);
  const sessionUrl = useSelector(selectSessionUrl);

  // this is just to explain why the page is being reset
  const [resetting, setResetting] = useState(false);
  useEffect(() => {
    if (recordingInProgress) {
      setResetting(true);
      setTimeout(() => {
        setResetting(false);
      }, 2000);
    } else {
      setResetting(false);
    }
  }, [recordingInProgress]);

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
      <div className="flex items-center justify-between mb-4">
        <Header />
        <div>
          <GrayLinkButton onClick={() => dispatch(logout())}>
            Logout
          </GrayLinkButton>
        </div>
      </div>
      <div className="h-24 w-full flex items-center justify-center text-gray-700">
        {recordingInProgress && (
          <div className="flex items-center">
            <Spinner />
            <div className="ml-4">
              {!resetting ? "Recording" : "Resetting page state"}...
            </div>
          </div>
        )}
        {!!sessionId && !sessionUrl && (
          <div className="flex items-center">
            <Spinner />
            <div className="ml-4">Saving...</div>
          </div>
        )}
        {!!sessionUrl && (
          <Link href={sessionUrl} download>
            Download recording
          </Link>
        )}
        {!recordingInProgress && !sessionId && !lastAborted && (
          <div>No existing recordings.</div>
        )}
        {lastAborted && <div>Last recording stopped due to page refresh.</div>}
      </div>
      <div className="flex justify-center">
        <Button
          disabled={!!sessionId && !sessionUrl}
          onClick={() => {
            if (recordingInProgress) {
              dispatch(stopRecording());
            } else {
              dispatch(startRecording());
            }
          }}
        >
          {recordingInProgress || (!!sessionId && !sessionUrl)
            ? "Finish recording"
            : "New recording"}
        </Button>
      </div>
    </div>
  );
};

export default Record;
