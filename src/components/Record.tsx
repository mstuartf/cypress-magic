import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  selectEmailAddress,
  selectLastRecordingAborted,
  selectRecordingInProgress,
  selectResetPageState,
  selectSessionId,
  selectToken,
} from "../redux/selectors";
import {
  getUserFailure,
  getUserPending,
  getUserSuccess,
  logout,
  resetPageState,
  startRecording,
  stopRecording,
} from "../redux/slice";
import Header from "./Header";
import Button from "./Button";
import Spinner from "./Spinner";
import GrayLinkButton from "./GrayLinkButton";
import { getUserRequest } from "../requests";

const Record = () => {
  const dispatch = useDispatch();

  const token = useSelector(selectToken);
  const recordingInProgress = useSelector(selectRecordingInProgress);
  const lastAborted = useSelector(selectLastRecordingAborted);
  const sessionId = useSelector(selectSessionId);
  const emailAddress = useSelector(selectEmailAddress);
  const resetPageStateRequired = useSelector(selectResetPageState);

  useEffect(() => {
    if (recordingInProgress) {
      setTimeout(() => {
        dispatch(resetPageState());
      }, 2000);
    }
  }, [recordingInProgress]);

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

  if (!!sessionId) {
    return <Redirect to="/generate" />;
  }

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
              {!resetPageStateRequired ? "Recording" : "Resetting page state"}
              ...
            </div>
          </div>
        )}
        {!recordingInProgress && !sessionId && !lastAborted && (
          <div>Click below to record a test.</div>
        )}
        {lastAborted && <div>Last recording stopped due to page refresh.</div>}
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => {
            if (recordingInProgress) {
              dispatch(stopRecording());
            } else {
              dispatch(startRecording());
            }
          }}
        >
          {recordingInProgress ? "Finish recording" : "New recording"}
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
