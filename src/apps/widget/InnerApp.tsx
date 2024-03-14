import React from "react";
import RecordingInProgress from "./RecordingInProgress";

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
