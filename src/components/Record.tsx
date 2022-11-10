import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  selectToken,
  selectLastRecordingAborted,
  selectRecordingInProgress,
  selectSessionId,
  selectSessionUrl,
  selectEmailAddress,
} from "../redux/selectors";
import {
  getSessionUrl,
  getUserFailure,
  getUserPending,
  getUserSuccess,
  logout,
  startRecording,
  stopRecording,
} from "../redux/slice";
import Header from "./Header";
import Button from "./Button";
import Spinner from "./Spinner";
import Link from "./Link";
import GrayLinkButton from "./GrayLinkButton";
import { getUserRequest, sessionUrlRequest } from "../requests";

const Record = () => {
  const dispatch = useDispatch();

  const token = useSelector(selectToken);
  const recordingInProgress = useSelector(selectRecordingInProgress);
  const lastAborted = useSelector(selectLastRecordingAborted);
  const sessionId = useSelector(selectSessionId);
  const sessionUrl = useSelector(selectSessionUrl);
  const emailAddress = useSelector(selectEmailAddress);

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
    if (!!sessionId && !sessionUrl && !!token) {
      sessionUrlRequest(sessionId, token).then(({ url: session_url }) => {
        dispatch(getSessionUrl({ session_url }));
      });
    }
  }, [sessionId, sessionUrl, token]);

  useEffect(() => {
    if (token) {
      dispatch(getUserPending());
      getUserRequest(token)
        .then(({ username, user_profile: { client_id } }) => {
          dispatch(getUserSuccess({ email_address: username, client_id }));
        })
        .catch(() => {
          dispatch(getUserFailure());
        });
    }
  }, [token]);

  if (!token) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="h-20 w-full flex items-center justify-center text-gray-700">
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
      <div className="flex flex-grow justify-between items-end text-xs">
        <div className="text-gray-400">{emailAddress}</div>
        <GrayLinkButton onClick={() => dispatch(logout())}>
          Logout
        </GrayLinkButton>
      </div>
    </div>
  );
};

export default Record;
