import React from "react";
import Header from "./Header";
import { setRecordingInProgress } from "./redux/slice";
import { useDispatch } from "react-redux";

const Setup = () => {
  const dispatch = useDispatch();
  const startRecording = () => {
    dispatch(setRecordingInProgress(true));
    window.location.reload();
  };
  return (
    <div className="grid">
      <Header>Welcome</Header>
      <button
        onClick={startRecording}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start recording
      </button>
    </div>
  );
};

export default Setup;
