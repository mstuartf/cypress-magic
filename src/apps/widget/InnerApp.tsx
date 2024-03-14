import React from "react";
import RecordingInProgress from "./RecordingInProgress";
import Header from "./Header";

function InnerApp({
  recordingInProgress,
  startRecording,
}: {
  recordingInProgress: boolean;
  startRecording: () => void;
}) {
  return (
    <>
      {recordingInProgress ? (
        <RecordingInProgress />
      ) : (
        <div className="grid">
          <Header>Welcome</Header>
          <button
            onClick={startRecording}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start recording
          </button>
        </div>
      )}
    </>
  );
}

export default InnerApp;
