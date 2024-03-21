import React, { useState } from "react";
import Header from "./Header";
import {
  setBaseUrl,
  setHasRefreshed,
  setRecordingInProgress,
} from "./redux/slice";
import { useDispatch } from "react-redux";

const Setup = () => {
  const dispatch = useDispatch();
  const [url, setUrl] = useState<string | undefined>();

  const startRecording = () => {
    dispatch(setBaseUrl(url));
    dispatch(setHasRefreshed(false));
    dispatch(setRecordingInProgress(true));
    window.location.reload();
  };

  return (
    <div className="cyw-grid">
      <Header>Welcome</Header>
      <div className="cyw-w-full cyw-mb-6">
        <label
          className="cyw-block cyw-uppercase cyw-tracking-wide cyw-text-gray-700 cyw-text-xs cyw-font-bold cyw-mb-2"
          htmlFor="grid-first-name"
        >
          Match API calls to:
        </label>
        <input
          value={url}
          onChange={({ target: { value } }) => setUrl(value)}
          className="cyw-text-xs cyw-appearance-none block cyw-w-full cyw-bg-gray-200 cyw-text-gray-700 cyw-border cyw-rounded cyw-py-3 cyw-px-4 cyw-mb-3 cyw-leading-tight focus:cyw-outline-none focus:cyw-bg-white"
          id="grid-first-name"
          type="text"
          placeholder="e.g. https://api.placeholder.com"
        />
        <p className="cyw-text-gray-600 cyw-text-xs cyw-italic">
          Only API calls made to URLS starting with this value will be matched
          and intercepted.
        </p>
      </div>
      <button
        onClick={startRecording}
        className="cyw-text-xs cyw-bg-blue-500 hover:cyw-bg-blue-700 cyw-text-white cyw-font-bold cyw-py-2 cyw-px-4 cyw-rounded"
      >
        Start recording
      </button>
    </div>
  );
};

export default Setup;
